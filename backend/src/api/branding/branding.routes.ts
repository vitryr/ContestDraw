/**
 * Branding API Routes
 */

import { Router } from "express";
import brandingController from "./branding.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// Public route for frontend config
router.get(
  "/:organizationId/config",
  brandingController.getFrontendConfig.bind(brandingController),
);

// All other routes require authentication
router.use(authMiddleware);

// Branding CRUD
router.get("/:organizationId", brandingController.get.bind(brandingController));
router.patch(
  "/:organizationId",
  brandingController.update.bind(brandingController),
);
router.post(
  "/:organizationId/reset",
  brandingController.reset.bind(brandingController),
);

// Logo and media
router.post(
  "/:organizationId/logo",
  brandingController.uploadLogo.bind(brandingController),
);

// Theme customization
router.patch(
  "/:organizationId/colors",
  brandingController.updateColors.bind(brandingController),
);
router.post(
  "/:organizationId/css",
  brandingController.setCustomCSS.bind(brandingController),
);

// Domain and white-label
router.post(
  "/:organizationId/domain",
  brandingController.setCustomDomain.bind(brandingController),
);
router.patch(
  "/:organizationId/remove",
  brandingController.toggleBrandingRemoval.bind(brandingController),
);

export default router;
