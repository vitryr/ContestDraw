import { Router } from "express";
import { body, query } from "express-validator";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import * as creditsController from "./credits.controller";

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/credits/balance
 * Get current credit balance
 */
router.get("/balance", creditsController.getBalance);

/**
 * POST /api/credits/purchase
 * Purchase credits (one-shot or packs)
 */
router.post(
  "/purchase",
  validate([
    body("packageId").notEmpty().withMessage("Package ID is required"),
    body("paymentMethod")
      .isIn(["card", "paypal"])
      .withMessage("Invalid payment method"),
  ]),
  creditsController.purchaseCredits,
);

/**
 * GET /api/credits/history
 * Get credit transaction history
 */
router.get(
  "/history",
  validate([
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("type")
      .optional()
      .isIn(["PURCHASE", "CONSUMPTION", "REFUND", "SUBSCRIPTION"]),
  ]),
  creditsController.getHistory,
);

/**
 * POST /api/credits/subscription
 * Create a subscription plan
 */
router.post(
  "/subscription",
  validate([
    body("planId").notEmpty().withMessage("Plan ID is required"),
    body("paymentMethod")
      .isIn(["card", "paypal"])
      .withMessage("Invalid payment method"),
  ]),
  creditsController.createSubscription,
);

/**
 * DELETE /api/credits/subscription
 * Cancel subscription
 */
router.delete("/subscription", creditsController.cancelSubscription);

/**
 * GET /api/credits/packages
 * Get available credit packages
 */
router.get("/packages", creditsController.getPackages);

export default router;
