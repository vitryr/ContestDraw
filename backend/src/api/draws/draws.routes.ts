import { Router } from "express";
import { body, param, query } from "express-validator";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { drawExecutionLimiter } from "../../middleware/rate-limit.middleware";
import * as drawsController from "./draws.controller";

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/draws
 * Create a new draw
 */
router.post(
  "/",
  validate([
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 200 }),
    body("description").optional().trim().isLength({ max: 1000 }),
    body("numberOfWinners")
      .isInt({ min: 1, max: 100 })
      .withMessage("Number of winners must be between 1 and 100"),
    body("participants")
      .optional()
      .isArray()
      .withMessage("Participants must be an array"),
    body("participants.*.name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Participant name is required"),
    body("participants.*.identifier")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Participant identifier is required"),
    body("allowDuplicates").optional().isBoolean(),
    body("status").optional().isIn(["draft", "configured", "ready"]),
    body("platform").optional().trim(),
    body("postUrl")
      .optional()
      .trim()
      .isURL()
      .withMessage("Post URL must be valid"),
  ]),
  drawsController.createDraw,
);

/**
 * GET /api/draws
 * List user draws with pagination
 */
router.get(
  "/",
  validate([
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("status")
      .optional()
      .isIn(["DRAFT", "READY", "PROCESSING", "COMPLETED", "FAILED"]),
    query("sortBy").optional().isIn(["createdAt", "title", "numberOfWinners"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
  ]),
  drawsController.listDraws,
);

/**
 * GET /api/draws/:id
 * Get draw details
 */
router.get(
  "/:id",
  validate([param("id").isUUID().withMessage("Invalid draw ID")]),
  drawsController.getDrawById,
);

/**
 * DELETE /api/draws/:id
 * Delete a draw
 */
router.delete(
  "/:id",
  validate([param("id").isUUID().withMessage("Invalid draw ID")]),
  drawsController.deleteDraw,
);

/**
 * POST /api/draws/:id/execute
 * Execute the draw algorithm
 */
router.post(
  "/:id/execute",
  drawExecutionLimiter,
  validate([
    param("id").isUUID().withMessage("Invalid draw ID"),
    body("algorithm").optional().isIn(["crypto-random", "fisher-yates"]),
    body("seed").optional().trim(),
  ]),
  drawsController.executeDraw,
);

/**
 * GET /api/draws/:id/certificate
 * Generate certificate PDF
 */
router.get(
  "/:id/certificate",
  validate([param("id").isUUID().withMessage("Invalid draw ID")]),
  drawsController.generateCertificate,
);

/**
 * POST /api/draws/:id/export
 * Export draw results to CSV/XLS
 */
router.post(
  "/:id/export",
  validate([
    param("id").isUUID().withMessage("Invalid draw ID"),
    body("format")
      .isIn(["csv", "xlsx"])
      .withMessage("Format must be csv or xlsx"),
  ]),
  drawsController.exportResults,
);

export default router;
