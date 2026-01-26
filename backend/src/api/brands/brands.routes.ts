/**
 * Brands API Routes
 */

import { Router } from "express";
import brandsController from "./brands.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Brand CRUD
router.post("/", brandsController.create.bind(brandsController));
router.get("/", brandsController.getUserBrands.bind(brandsController));
router.get("/:id", brandsController.getById.bind(brandsController));
router.patch("/:id", brandsController.update.bind(brandsController));
router.delete("/:id", brandsController.delete.bind(brandsController));

// Social accounts
router.get(
  "/:id/social-accounts",
  brandsController.getSocialAccounts.bind(brandsController),
);
router.post(
  "/:id/social-accounts",
  brandsController.connectSocialAccount.bind(brandsController),
);

// Draws
router.get("/:id/draws", brandsController.getDraws.bind(brandsController));
router.post("/:id/draws", brandsController.assignDraw.bind(brandsController));

// Analytics
router.get(
  "/:id/analytics",
  brandsController.getAnalytics.bind(brandsController),
);

export default router;
