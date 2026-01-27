import { Router } from "express";
import { body, param, query } from "express-validator";
import multer from "multer";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { drawExecutionLimiter } from "../../middleware/rate-limit.middleware";
import * as drawsController from "./draws.controller";

// Configure multer for CSV uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

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
 * PUT /api/draws/:id
 * Update a draw
 */
router.put(
  "/:id",
  validate([
    param("id").isUUID().withMessage("Invalid draw ID"),
    body("title").optional().trim().notEmpty().isLength({ max: 200 }),
    body("description").optional().trim().isLength({ max: 1000 }),
    body("numberOfWinners")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Number of winners must be between 1 and 100"),
    body("allowDuplicates").optional().isBoolean(),
    body("status").optional().isIn(["draft", "configured", "ready"]),
    body("platform").optional().trim(),
    body("postUrl")
      .optional()
      .trim()
      .isURL()
      .withMessage("Post URL must be valid"),
  ]),
  drawsController.updateDraw,
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
 * POST /api/draws/:id/upload
 * Upload participants from CSV file
 */
router.post(
  "/:id/upload",
  upload.single("file"),
  validate([param("id").isUUID().withMessage("Invalid draw ID")]),
  drawsController.uploadParticipants,
);

/**
 * POST /api/draws/:id/import
 * Import participants from social media URL
 */
router.post(
  "/:id/import",
  validate([
    param("id").isUUID().withMessage("Invalid draw ID"),
    body("source").trim().notEmpty().withMessage("Source is required"),
    body("url").optional().trim().isURL().withMessage("URL must be valid"),
  ]),
  drawsController.importParticipants,
);

/**
 * GET /api/draws/:id/winners
 * Get winners for a completed draw
 */
router.get(
  "/:id/winners",
  validate([param("id").isUUID().withMessage("Invalid draw ID")]),
  drawsController.getWinners,
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
 * GET /api/draws/:id/video
 * Generate video/animation for the draw
 */
router.get(
  "/:id/video",
  validate([param("id").isUUID().withMessage("Invalid draw ID")]),
  drawsController.generateDrawVideo,
);

/**
 * POST /api/draws/:id/video/generate
 * Queue background video generation (MP4)
 */
router.post(
  "/:id/video/generate",
  validate([param("id").isUUID().withMessage("Invalid draw ID")]),
  drawsController.queueVideoGeneration,
);

/**
 * GET /api/draws/:id/video/status
 * Get the latest video job status for a draw
 */
router.get(
  "/:id/video/status",
  validate([param("id").isUUID().withMessage("Invalid draw ID")]),
  drawsController.getDrawVideoStatus,
);

/**
 * GET /api/draws/:id/video/status/:jobId
 * Check video generation job status
 */
router.get(
  "/:id/video/status/:jobId",
  validate([
    param("id").isUUID().withMessage("Invalid draw ID"),
    param("jobId").isUUID().withMessage("Invalid job ID"),
  ]),
  drawsController.getVideoJobStatus,
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
