import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import {
  generateQRCode,
  resolveShortCode,
  createShareableLink,
  generateSocialShareUrls,
  generateEmbedCode,
} from "../../services/sharing.service";
import {
  verifyDrawHash,
  formatHashForDisplay,
  generateVerificationCode,
} from "../../utils/hash.util";
import { CertificateService } from "../../services/certificate.service";

const prisma = new PrismaClient();
const certificateService = new CertificateService();

/**
 * Public Verification Controller
 * No authentication required - provides transparency for draw results
 */

/**
 * GET /api/public/verify/:drawId
 * Get public verification data for a draw
 */
export async function getDrawVerification(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { drawId } = req.params;

    // Fetch draw with related data
    const draw = await prisma.draw.findUnique({
      where: { id: drawId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: false, // Privacy: don't expose email
          },
        },
        winners: {
          include: {
            participant: true,
          },
          orderBy: {
            position: "asc",
          },
        },
        participants: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            platform: true,
            // Don't include sensitive metadata
          },
        },
      },
    });

    if (!draw) {
      res.status(404).json({
        error: "Draw not found",
        message: "The requested draw does not exist or has been deleted",
      });
      return;
    }

    // Only show completed draws
    if (draw.status !== "executed" && draw.status !== "completed") {
      res.status(403).json({
        error: "Draw not accessible",
        message: "This draw has not been executed yet",
      });
      return;
    }

    // Build verification data
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const verificationUrl = `${baseUrl}/verify/${drawId}`;

    // Generate shareable link
    const shareableLink = await createShareableLink(drawId, baseUrl);

    // Generate social share URLs
    const socialUrls = generateSocialShareUrls(drawId, draw.title, baseUrl);

    // Format response
    const response = {
      draw: {
        id: draw.id,
        title: draw.title,
        description: draw.description,
        platform: draw.platform,
        status: draw.status,
        createdAt: draw.createdAt,
        executedAt: draw.executedAt,
        participantsCount: draw.participants.length,
        winnersCount: draw.winners.length,
        filters: draw.filters,
        organizer: {
          name: draw.user.name,
        },
      },
      winners: draw.winners.map((winner) => ({
        id: winner.id,
        position: winner.position,
        participant: {
          username: winner.participant.username,
          name: winner.participant.name,
          avatar: winner.participant.avatar,
          platform: winner.participant.platform,
        },
        selectedAt: winner.selectedAt,
        certificateUrl: winner.certificateUrl,
      })),
      participants: draw.participants.map((p) => ({
        username: p.username,
        name: p.name,
        avatar: p.avatar,
        platform: p.platform,
      })),
      verification: {
        hash: draw.verificationHash || "N/A",
        verificationCode: draw.verificationHash
          ? generateVerificationCode(draw.verificationHash)
          : "N/A",
        algorithm: "Cryptographically Secure PRNG (crypto.randomBytes)",
        hashAlgorithm: "SHA-256",
        verified: !!draw.verificationHash,
      },
      sharing: {
        verificationUrl,
        shortUrl: shareableLink.fullUrl,
        shortCode: shareableLink.shortCode,
        qrCodeUrl: shareableLink.qrCodeUrl,
        socialUrls,
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/public/verify-hash/:drawId
 * Verify the integrity of a draw's hash
 */
export async function verifyHash(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { drawId } = req.params;
    const { hash } = req.body;

    if (!hash) {
      res.status(400).json({
        error: "Hash required",
        message: "Please provide a hash to verify",
      });
      return;
    }

    // Fetch draw data
    const draw = await prisma.draw.findUnique({
      where: { id: drawId },
      include: {
        winners: {
          include: {
            participant: true,
          },
        },
        participants: true,
      },
    });

    if (!draw) {
      res.status(404).json({
        error: "Draw not found",
      });
      return;
    }

    // Check if stored hash matches provided hash
    const hashMatches = draw.verificationHash === hash;

    res.json({
      verified: hashMatches,
      message: hashMatches
        ? "Hash verification successful - certificate is authentic"
        : "Hash verification failed - certificate may be tampered with",
      expectedHash: draw.verificationHash,
      providedHash: hash,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/public/qr/:shortCode
 * Generate QR code for verification URL
 */
export async function getQRCode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { shortCode } = req.params;

    // Resolve short code to draw ID
    const drawId = resolveShortCode(shortCode);

    if (!drawId) {
      res.status(404).json({
        error: "Invalid or expired code",
      });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const verificationUrl = `${baseUrl}/verify/${drawId}`;

    // Generate QR code
    const qrSvg = generateQRCode(verificationUrl);

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(qrSvg);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/public/short/:shortCode
 * Redirect short code to full verification page
 */
export async function redirectShortCode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { shortCode } = req.params;

    const drawId = resolveShortCode(shortCode);

    if (!drawId) {
      res.status(404).json({
        error: "Invalid or expired code",
      });
      return;
    }

    res.redirect(`/verify/${drawId}`);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/public/embed-code/:drawId
 * Get embed code for verification widget
 */
export async function getEmbedCode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { drawId } = req.params;
    const {
      width = 600,
      height = 400,
      theme = "light",
      showParticipants = false,
    } = req.query;

    // Verify draw exists
    const draw = await prisma.draw.findUnique({
      where: { id: drawId },
      select: { id: true, status: true },
    });

    if (!draw || draw.status !== "executed") {
      res.status(404).json({
        error: "Draw not found or not executed",
      });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const embedCode = generateEmbedCode(
      {
        drawId,
        width: Number(width),
        height: Number(height),
        theme: theme as "light" | "dark",
        showParticipants: showParticipants === "true",
      },
      baseUrl,
    );

    res.json({
      drawId,
      embedCode,
      previewUrl: `${baseUrl}/embed/${drawId}`,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/public/certificate/:drawId/:winnerId
 * Download certificate for a specific winner
 */
export async function downloadCertificate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { drawId, winnerId } = req.params;

    // Fetch winner data
    const winner = await prisma.winner.findFirst({
      where: {
        id: winnerId,
        drawId: drawId,
      },
      include: {
        draw: {
          include: {
            user: true,
          },
        },
        participant: true,
      },
    });

    if (!winner) {
      res.status(404).json({
        error: "Winner not found",
      });
      return;
    }

    // If certificate already exists, redirect to it
    if (winner.certificateUrl) {
      res.redirect(winner.certificateUrl);
      return;
    }

    // Generate certificate (implementation depends on your certificate service)
    res.status(501).json({
      error: "Certificate generation not implemented",
      message: "Please contact support",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/public/stats
 * Get public platform statistics
 */
export async function getPublicStats(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const [totalDraws, totalWinners, totalParticipants] = await Promise.all([
      prisma.draw.count({ where: { status: "executed" } }),
      prisma.winner.count(),
      prisma.participant.count(),
    ]);

    res.json({
      stats: {
        totalDraws,
        totalWinners,
        totalParticipants,
        transparency: {
          publicVerification: true,
          cryptographicProof: true,
          openSource: false,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/public/contact
 * Send contact form email via Resend
 */
export async function sendContactEmail(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // Import Resend
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email to support
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Cleack <support@cleack.io>",
      to: ["support@cleack.io"],
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">New Contact Form Submission</h2>
          <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="padding: 20px; border-left: 4px solid #7c3aed;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e4e4e7;" />
          <p style="color: #71717a; font-size: 12px;">
            This message was sent from the Cleack contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[Contact] Resend error:", error);
      res.status(500).json({ error: "Failed to send email" });
      return;
    }

    // Send confirmation email to user
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Cleack <support@cleack.io>",
      to: [email],
      subject: "We received your message - Cleack",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Thank you for contacting us!</h2>
          <p>Hi ${name},</p>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <p style="white-space: pre-wrap; color: #52525b;">${message}</p>
          </div>
          <p>Best regards,<br/>The Cleack Team</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e4e4e7;" />
          <p style="color: #71717a; font-size: 12px;">
            Cleack - Fair & Automated Contest Draws<br/>
            <a href="https://cleack.io" style="color: #7c3aed;">cleack.io</a>
          </p>
        </div>
      `,
    });

    res.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error("[Contact] Error:", error);
    next(error);
  }
}
