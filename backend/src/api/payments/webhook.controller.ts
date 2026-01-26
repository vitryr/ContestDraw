/**
 * Payment Webhook Controller
 * Handles Stripe and Apple IAP webhook endpoints
 */

import { Router, Request, Response, NextFunction } from "express";
import { PaymentService } from "../../services/payment.service";
import { AppleIAPService } from "../../services/apple-iap.service";

export class WebhookController {
  public router: Router;

  constructor(
    private paymentService: PaymentService,
    private appleIAPService: AppleIAPService,
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Stripe webhook (requires raw body for signature verification)
    this.router.post(
      "/webhook/stripe",
      this.rawBodyParser,
      this.handleStripeWebhook.bind(this),
    );

    // Apple IAP webhook
    this.router.post("/webhook/apple", this.handleAppleWebhook.bind(this));

    // Health check
    this.router.get("/webhook/health", (req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });
  }

  /**
   * Middleware to parse raw body for Stripe signature verification
   */
  private rawBodyParser(req: Request, res: Response, next: NextFunction): void {
    if (req.headers["content-type"] === "application/json") {
      let data = "";
      req.setEncoding("utf8");
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        (req as any).rawBody = Buffer.from(data, "utf8");
        try {
          req.body = JSON.parse(data);
        } catch (error) {
          return res.status(400).json({ error: "Invalid JSON" });
        }
        next();
      });
    } else {
      next();
    }
  }

  /**
   * Handle Stripe webhook events
   */
  private async handleStripeWebhook(
    req: Request,
    res: Response,
  ): Promise<void> {
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
      res.status(400).json({ error: "Missing Stripe signature" });
      return;
    }

    try {
      const rawBody = (req as any).rawBody;
      if (!rawBody) {
        res.status(400).json({ error: "Missing request body" });
        return;
      }

      await this.paymentService.handleStripeWebhook(rawBody, signature);

      // Return 200 immediately to acknowledge receipt
      res.json({ received: true });
    } catch (error) {
      console.error("[Webhook] Stripe webhook error:", error);

      if (error instanceof Error) {
        if (error.message.includes("signature")) {
          res.status(400).json({ error: "Invalid signature" });
          return;
        }
      }

      res.status(500).json({ error: "Webhook processing failed" });
    }
  }

  /**
   * Handle Apple IAP webhook events
   * Apple sends notifications for subscription changes, renewals, etc.
   */
  private async handleAppleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { notification_type, unified_receipt, password } = req.body;

      // Verify shared secret (basic authentication)
      if (password !== process.env.APPLE_SHARED_SECRET) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      console.log(`[Webhook] Apple notification type: ${notification_type}`);

      // Extract receipt data
      const latestReceiptInfo = unified_receipt?.latest_receipt_info?.[0];
      if (!latestReceiptInfo) {
        res.status(400).json({ error: "Missing receipt info" });
        return;
      }

      const userId = latestReceiptInfo.app_account_token; // Custom user identifier
      const transactionId = latestReceiptInfo.transaction_id;

      // Handle different notification types
      switch (notification_type) {
        case "INITIAL_BUY":
        case "DID_RENEW":
          // Validate and process receipt
          await this.appleIAPService.validateReceipt(
            unified_receipt.latest_receipt,
            userId,
          );
          break;

        case "CANCEL":
          // Handle subscription cancellation
          await this.appleIAPService.handleSubscriptionCancellation(
            transactionId,
          );
          break;

        case "DID_FAIL_TO_RENEW":
        case "GRACE_PERIOD_EXPIRED":
          // Handle payment failures
          console.log(
            `[Webhook] Apple subscription payment failed: ${transactionId}`,
          );
          await this.appleIAPService.checkSubscriptionRenewals(userId);
          break;

        case "REFUND":
          // Handle refund (requires manual review)
          console.log(
            `[Webhook] Apple refund issued for transaction: ${transactionId}`,
          );
          // TODO: Implement refund handling
          break;

        default:
          console.log(
            `[Webhook] Unhandled Apple notification type: ${notification_type}`,
          );
      }

      res.json({ received: true });
    } catch (error) {
      console.error("[Webhook] Apple webhook error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  }

  /**
   * Get webhook event logs (admin only)
   */
  async getWebhookLogs(req: Request, res: Response): Promise<void> {
    try {
      const { provider, limit = 50, offset = 0 } = req.query;

      const where = provider ? { provider: provider as string } : {};

      const logs = await (this.paymentService as any).db.webhookEvent.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      });

      res.json({
        logs,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: logs.length,
        },
      });
    } catch (error) {
      console.error("[Webhook] Error fetching logs:", error);
      res.status(500).json({ error: "Failed to fetch webhook logs" });
    }
  }
}

/**
 * Factory function to create webhook router
 */
export function createWebhookRouter(
  paymentService: PaymentService,
  appleIAPService: AppleIAPService,
): Router {
  const controller = new WebhookController(paymentService, appleIAPService);
  return controller.router;
}
