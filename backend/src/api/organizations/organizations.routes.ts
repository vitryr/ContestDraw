/**
 * Organizations API Routes
 */

import { Router } from "express";
import organizationsController from "./organizations.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Organization CRUD
router.post("/", organizationsController.create.bind(organizationsController));
router.get(
  "/",
  organizationsController.getUserOrganizations.bind(organizationsController),
);
router.get(
  "/:id",
  organizationsController.getById.bind(organizationsController),
);
router.patch(
  "/:id",
  organizationsController.update.bind(organizationsController),
);
router.delete(
  "/:id",
  organizationsController.delete.bind(organizationsController),
);

// Dashboard
router.get(
  "/:id/dashboard",
  organizationsController.getDashboard.bind(organizationsController),
);

// Members management
router.get(
  "/:id/members",
  organizationsController.getMembers.bind(organizationsController),
);
router.post(
  "/:id/members",
  organizationsController.inviteMember.bind(organizationsController),
);
router.delete(
  "/:id/members/:userId",
  organizationsController.removeMember.bind(organizationsController),
);
router.patch(
  "/:id/members/:userId",
  organizationsController.updateMemberRole.bind(organizationsController),
);

export default router;
