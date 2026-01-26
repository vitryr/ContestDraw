import { Router } from "express";
import * as publicController from "./public.controller";

const router = Router();

/**
 * Public verification routes
 * No authentication required - provides transparency
 */

// Main verification endpoint
router.get("/verify/:drawId", publicController.getDrawVerification);

// Hash verification
router.post("/verify-hash/:drawId", publicController.verifyHash);

// QR code generation
router.get("/qr/:shortCode", publicController.getQRCode);

// Short URL redirect
router.get("/short/:shortCode", publicController.redirectShortCode);

// Embed code generation
router.get("/embed-code/:drawId", publicController.getEmbedCode);

// Certificate download
router.get(
  "/certificate/:drawId/:winnerId",
  publicController.downloadCertificate,
);

// Public statistics
router.get("/stats", publicController.getPublicStats);

export default router;
