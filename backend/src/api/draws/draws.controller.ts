import { Response } from "express";
import crypto from "crypto";
import {
  AuthRequest,
  DrawStatus,
  DrawParticipant,
  DrawResult,
  PaginatedResponse,
} from "../../types";
import { asyncHandler, AppError } from "../../middleware/error.middleware";
import { logger } from "../../utils/logger";
import { selectWinners } from "../../services/random.service";
import { generateCertificatePDF } from "../../services/certificate.service";
import {
  generateDrawVideo as generateVideo,
  generateVideoData,
} from "../../services/video.service";
import { prisma } from "../../utils/prisma";

/**
 * POST /api/draws
 * Create a new draw
 */
export const createDraw = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const {
      title,
      description,
      numberOfWinners,
      participants,
      allowDuplicates,
      status,
      platform,
      postUrl,
    } = req.body;

    // For draft draws, participants are optional
    const isDraft =
      status === "draft" || !participants || participants.length === 0;

    // Validate number of winners only if participants are provided
    if (participants && participants.length > 0) {
      if (numberOfWinners > participants.length && !allowDuplicates) {
        throw new AppError(
          "Number of winners cannot exceed number of participants",
          400,
          "INVALID_WINNERS_COUNT",
        );
      }
    }

    // Create draw with Prisma
    const draw = await prisma.draw.create({
      data: {
        userId: req.user.id,
        title,
        description: description || null,
        numberOfWinners,
        allowDuplicates: allowDuplicates || false,
        status: isDraft ? "DRAFT" : "READY",
        platform: platform || null,
        postUrl: postUrl || null,
        participants:
          participants && participants.length > 0
            ? {
                create: participants.map((p: any) => ({
                  name: p.name,
                  identifier: p.identifier,
                  source: p.source || "MANUAL",
                  metadata: p.metadata || {},
                })),
              }
            : undefined,
      },
      include: {
        participants: true,
      },
    });

    logger.info(
      `Draw created: ${draw.id} by user ${req.user.id} (status: ${draw.status})`,
    );

    res.status(201).json({
      status: "success",
      message: "Draw created successfully",
      data: { draw },
    });
  },
);

/**
 * GET /api/draws
 * List user draws with pagination
 */
export const listDraws = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string | undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    // Build where clause
    const where: any = { userId: req.user.id };
    if (status) {
      where.status = status;
    }

    // Count total
    const total = await prisma.draw.count({ where });

    // Fetch draws with pagination
    const userDraws = await prisma.draw.findMany({
      where,
      include: {
        participants: true,
        winners: {
          include: {
            participant: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const response: PaginatedResponse<any> = {
      data: userDraws,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    res.status(200).json({
      status: "success",
      ...response,
    });
  },
);

/**
 * GET /api/draws/:id
 * Get draw details
 */
export const getDrawById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { id } = req.params;
    const draw = await prisma.draw.findUnique({
      where: { id },
      include: {
        participants: true,
        winners: {
          include: {
            participant: true,
          },
        },
      },
    });

    if (!draw) {
      throw new AppError("Draw not found", 404, "DRAW_NOT_FOUND");
    }

    if (draw.userId !== req.user.id) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    res.status(200).json({
      status: "success",
      data: { draw },
    });
  },
);

/**
 * PUT /api/draws/:id
 * Update a draw
 */
export const updateDraw = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { id } = req.params;

    // Check if draw exists and belongs to user
    const existingDraw = await prisma.draw.findUnique({
      where: { id },
    });

    if (!existingDraw) {
      throw new AppError("Draw not found", 404, "DRAW_NOT_FOUND");
    }

    if (existingDraw.userId !== req.user.id) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    if (existingDraw.status === "COMPLETED") {
      throw new AppError(
        "Cannot modify completed draw",
        400,
        "DRAW_ALREADY_COMPLETED",
      );
    }

    const {
      title,
      description,
      numberOfWinners,
      allowDuplicates,
      status,
      platform,
      postUrl,
      filters,
    } = req.body;

    // Build update data - only include provided fields
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (numberOfWinners !== undefined) updateData.numberOfWinners = numberOfWinners;
    if (allowDuplicates !== undefined) updateData.allowDuplicates = allowDuplicates;
    if (status !== undefined) {
      // Map status to uppercase enum
      const statusMap: Record<string, string> = {
        draft: "DRAFT",
        configured: "CONFIGURED",
        ready: "READY",
      };
      updateData.status = statusMap[status.toLowerCase()] || status.toUpperCase();
    }
    if (platform !== undefined) updateData.platform = platform;
    if (postUrl !== undefined) updateData.postUrl = postUrl;
    if (filters !== undefined) updateData.filters = filters;

    // Update draw in database
    const updatedDraw = await prisma.draw.update({
      where: { id },
      data: updateData,
      include: {
        participants: true,
        winners: {
          include: {
            participant: true,
          },
        },
      },
    });

    logger.info(`Draw updated: ${id} by user ${req.user.id}`);

    res.status(200).json({
      status: "success",
      message: "Draw updated successfully",
      data: updatedDraw,
    });
  },
);

/**
 * DELETE /api/draws/:id
 * Delete a draw
 */
export const deleteDraw = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { id } = req.params;
    const draw = await prisma.draw.findUnique({
      where: { id },
    });

    if (!draw) {
      throw new AppError("Draw not found", 404, "DRAW_NOT_FOUND");
    }

    if (draw.userId !== req.user.id) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    await prisma.draw.delete({
      where: { id },
    });

    logger.info(`Draw deleted: ${id} by user ${req.user.id}`);

    res.status(200).json({
      status: "success",
      message: "Draw deleted successfully",
    });
  },
);

/**
 * POST /api/draws/:id/execute
 * Execute the draw algorithm
 */
export const executeDraw = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { id } = req.params;
    const { algorithm = "crypto-random", seed } = req.body;

    const draw = await prisma.draw.findUnique({
      where: { id },
      include: {
        participants: true,
      },
    });

    if (!draw) {
      throw new AppError("Draw not found", 404, "DRAW_NOT_FOUND");
    }

    if (draw.userId !== req.user.id) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    if (draw.status === "COMPLETED") {
      throw new AppError("Draw already executed", 400, "DRAW_ALREADY_EXECUTED");
    }

    // Check user credits before executing
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { credits: true },
    });

    if (!user || user.credits < 1) {
      throw new AppError(
        "Insufficient credits. Please purchase more credits to execute a draw.",
        402,
        "INSUFFICIENT_CREDITS",
      );
    }

    // Update status to processing
    await prisma.draw.update({
      where: { id },
      data: { status: "PROCESSING" },
    });

    try {
      // Convert participants to format expected by selectWinners
      const participantsForSelection = draw.participants.map((p) => ({
        id: p.id,
        name: p.name,
        identifier: p.identifier,
        source: p.source,
        metadata: p.metadata as Record<string, any> || {},
      }));

      // Execute random selection
      const winners = selectWinners(
        participantsForSelection,
        draw.numberOfWinners,
        draw.allowDuplicates,
        seed,
      );

      // Generate certificate hash
      const certificateData = JSON.stringify({
        drawId: draw.id,
        winners: winners.map((w) => w.id),
        timestamp: new Date().toISOString(),
        algorithm,
        seed: seed || "auto-generated",
      });
      const certificateHash = crypto
        .createHash("sha256")
        .update(certificateData)
        .digest("hex");

      // Update draw with completion status
      const completedDraw = await prisma.draw.update({
        where: { id },
        data: {
          status: "COMPLETED",
          algorithm,
          seed: seed || "auto-generated",
          certificateHash,
          completedAt: new Date(),
        },
      });

      // Create winner records in database
      await prisma.winner.createMany({
        data: winners.map((winner, index) => ({
          drawId: id,
          participantId: winner.id,
          position: index + 1,
        })),
      });

      // Deduct 1 credit for executing the draw
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { credits: { decrement: 1 } },
        select: { credits: true },
      });

      logger.info(
        `Draw executed: ${id} by user ${req.user.id}. Credits remaining: ${updatedUser.credits}`,
      );

      // Format winners for frontend (DrawAnimation expects nested participant object)
      const formattedWinners = winners.map(
        (participant: DrawParticipant, index: number) => ({
          id: participant.id,
          position: index + 1,
          participant: {
            id: participant.id,
            name: participant.name,
            username: participant.identifier,
            platform: participant.source?.toLowerCase() || "manual",
            avatar: participant.metadata?.avatar || null,
          },
          certificateUrl: null,
        }),
      );

      // Create result object for response
      const result: DrawResult = {
        winners,
        timestamp: new Date(),
        algorithm,
        seed: seed || "auto-generated",
        certificateHash,
      };

      res.status(200).json({
        status: "success",
        message: "Draw executed successfully",
        data: {
          draw: completedDraw,
          result: { ...result, winners: formattedWinners },
          winners: formattedWinners,
          creditsRemaining: updatedUser.credits,
        },
      });
    } catch (error: any) {
      // Update draw status to FAILED
      await prisma.draw.update({
        where: { id },
        data: { status: "FAILED" },
      });
      logger.error(`Draw execution failed: ${id}`, error);
      throw new AppError("Draw execution failed", 500, "EXECUTION_FAILED");
    }
  },
);

/**
 * GET /api/draws/:id/winners
 * Get winners for a completed draw
 */
export const getWinners = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { id } = req.params;
    const draw = await prisma.draw.findUnique({
      where: { id },
      include: {
        winners: {
          include: {
            participant: true,
          },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!draw) {
      throw new AppError("Draw not found", 404, "DRAW_NOT_FOUND");
    }

    if (draw.userId !== req.user.id) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    if (draw.status !== "COMPLETED") {
      throw new AppError("Draw not completed", 400, "DRAW_NOT_COMPLETED");
    }

    // Transform winners to expected format with position
    const winners = draw.winners.map((winner) => ({
      id: winner.id,
      position: winner.position,
      participant: {
        id: winner.participant.id,
        name: winner.participant.name,
        username: winner.participant.identifier,
        platform: winner.participant.source?.toLowerCase() || "manual",
        avatar: (winner.participant.metadata as any)?.avatar || null,
      },
      certificateUrl: null,
    }));

    res.status(200).json({
      status: "success",
      data: winners,
    });
  },
);

/**
 * GET /api/draws/:id/certificate
 * Generate certificate PDF
 */
export const generateCertificate = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { id } = req.params;
    const draw = await prisma.draw.findUnique({
      where: { id },
      include: {
        winners: {
          include: {
            participant: true,
          },
          orderBy: { position: "asc" },
        },
        participants: true,
      },
    });

    if (!draw) {
      throw new AppError("Draw not found", 404, "DRAW_NOT_FOUND");
    }

    if (draw.userId !== req.user.id) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    if (draw.status !== "COMPLETED") {
      throw new AppError("Draw not completed", 400, "DRAW_NOT_COMPLETED");
    }

    // Transform Prisma draw to DrawResult format expected by certificate service
    const drawResult: DrawResult = {
      drawId: draw.id,
      timestamp: draw.completedAt || draw.updatedAt,
      totalParticipants: draw.participants.length,
      eligibleParticipants: draw.participants.length,
      winners: draw.winners.map((w) => ({
        participant: {
          id: w.participant.id,
          username: w.participant.identifier,
          comment: "",
          timestamp: w.participant.createdAt,
          mentions: [],
          hashtags: [],
        },
        position: w.position,
        selectedAt: w.createdAt,
        seed: crypto.randomBytes(8).toString("hex"),
      })),
      alternates: [],
      filters: {
        removeDuplicates: !draw.allowDuplicates,
        maxEntriesPerUser: null,
        minMentions: 0,
        verifyFollowing: false,
      },
      algorithm: "crypto-random",
    };

    // Generate PDF
    const { buffer } = await generateCertificatePDF(drawResult);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="draw-${id}-certificate.pdf"`,
    );
    res.send(buffer);
  },
);

/**
 * GET /api/draws/:id/video
 * Generate video/animation for the draw
 */
export const generateDrawVideo = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { id } = req.params;
    const draw = await prisma.draw.findUnique({
      where: { id },
      include: {
        winners: {
          include: {
            participant: true,
          },
          orderBy: { position: "asc" },
        },
        participants: true,
      },
    });

    if (!draw) {
      throw new AppError("Draw not found", 404, "DRAW_NOT_FOUND");
    }

    if (draw.userId !== req.user.id) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    if (draw.status !== "COMPLETED") {
      throw new AppError("Draw not completed", 400, "DRAW_NOT_COMPLETED");
    }

    // Transform draw data for video generation
    const drawData = {
      id: draw.id,
      title: draw.title,
      winners: draw.winners.map((w) => ({
        position: w.position,
        participant: {
          name: w.participant.name,
          identifier: w.participant.identifier,
        },
      })),
      participants: draw.participants.map((p) => ({
        name: p.name,
        identifier: p.identifier,
      })),
    };

    try {
      // Generate video poster/thumbnail image
      const videoBuffer = await generateVideo(drawData);

      // Return as PNG image (video poster)
      // For full video, would need ffmpeg integration
      res.setHeader("Content-Type", "image/png");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="draw-${id}-video.png"`,
      );
      res.send(videoBuffer);
    } catch (error) {
      logger.error("Video generation error:", error);

      // Fallback: Return video data as JSON for frontend animation
      const videoData = generateVideoData(drawData);
      res.setHeader("Content-Type", "application/json");
      res.json({
        status: "success",
        message: "Video data generated for frontend animation",
        data: videoData,
      });
    }
  },
);

/**
 * Parse CSV content into array of objects
 */
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  // Parse headers (first line)
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  // Parse data rows
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length === headers.length) {
      const row: Record<string, string> = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx];
      });
      rows.push(row);
    }
  }

  return rows;
}

/**
 * POST /api/draws/:id/upload
 * Upload participants from CSV file
 */
export const uploadParticipants = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { id } = req.params;
    const draw = await prisma.draw.findUnique({
      where: { id },
    });

    if (!draw) {
      throw new AppError("Draw not found", 404, "DRAW_NOT_FOUND");
    }

    if (draw.userId !== req.user.id) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    if (draw.status === "COMPLETED") {
      throw new AppError(
        "Cannot modify completed draw",
        400,
        "DRAW_ALREADY_COMPLETED",
      );
    }

    // Check if file was uploaded
    const file = req.file;
    if (!file) {
      throw new AppError("CSV file is required", 400, "FILE_REQUIRED");
    }

    // Parse CSV content
    const csvContent = file.buffer.toString("utf-8");
    const parsedRows = parseCSV(csvContent);

    if (parsedRows.length === 0) {
      throw new AppError(
        "CSV file is empty or invalid format",
        400,
        "INVALID_CSV",
      );
    }

    // Clear existing participants first (re-upload replaces all participants)
    await prisma.participant.deleteMany({
      where: { drawId: id },
    });

    // Create participants in database
    const participantData = parsedRows.map((row) => ({
      drawId: id,
      name: row.name || row.username || row.identifier || row.email || "Unknown",
      identifier:
        row.identifier || row.username || row.email || row.name || "Unknown",
      source: "CSV",
      metadata: {
        email: row.email,
        originalData: row,
      },
    }));

    await prisma.participant.createMany({
      data: participantData,
    });

    // Update draw status
    const updatedDraw = await prisma.draw.update({
      where: { id },
      data: { status: "READY" },
      include: {
        participants: true,
      },
    });

    logger.info(
      `Participants uploaded to draw ${id}: ${participantData.length} participants (replaced existing)`,
    );

    res.status(200).json({
      status: "success",
      message: `${participantData.length} participants added successfully`,
      data: {
        draw: updatedDraw,
        participants: updatedDraw.participants,
        addedCount: participantData.length,
        totalParticipants: updatedDraw.participants.length,
      },
    });
  },
);

/**
 * POST /api/draws/:id/import
 * Import participants from social media URL
 */
export const importParticipants = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { id } = req.params;
    const { source, url } = req.body;

    const draw = await prisma.draw.findUnique({
      where: { id },
    });

    if (!draw) {
      throw new AppError("Draw not found", 404, "DRAW_NOT_FOUND");
    }

    if (draw.userId !== req.user.id) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    if (draw.status === "COMPLETED") {
      throw new AppError(
        "Cannot modify completed draw",
        400,
        "DRAW_ALREADY_COMPLETED",
      );
    }

    // Clear existing participants first (re-import replaces all participants)
    await prisma.participant.deleteMany({
      where: { drawId: id },
    });

    // In production, this would call the social media API to fetch participants
    // For now, return mock data based on the source
    const mockParticipants = Array.from({ length: 25 }, (_, i) => ({
      drawId: id,
      name: `${source} User ${i + 1}`,
      identifier: `@${source.toLowerCase()}_user_${i + 1}`,
      source: source.toUpperCase(),
      metadata: {
        profileUrl: `https://${source.toLowerCase()}.com/user${i + 1}`,
        importedFrom: url,
        importedAt: new Date().toISOString(),
      },
    }));

    await prisma.participant.createMany({
      data: mockParticipants,
    });

    // Update draw status and postUrl
    const updatedDraw = await prisma.draw.update({
      where: { id },
      data: {
        status: "READY",
        postUrl: url || null,
      },
      include: {
        participants: true,
      },
    });

    logger.info(
      `Participants imported to draw ${id} from ${source}: ${mockParticipants.length} participants added`,
    );

    res.status(200).json({
      status: "success",
      message: `${mockParticipants.length} participants imported from ${source}`,
      data: {
        draw: updatedDraw,
        participants: updatedDraw.participants,
        addedCount: mockParticipants.length,
        totalParticipants: updatedDraw.participants.length,
      },
    });
  },
);

/**
 * POST /api/draws/:id/export
 * Export draw results to CSV/XLS
 */
export const exportResults = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { id } = req.params;
    const { format } = req.body;

    const draw = await prisma.draw.findUnique({
      where: { id },
      include: {
        winners: {
          include: {
            participant: true,
          },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!draw) {
      throw new AppError("Draw not found", 404, "DRAW_NOT_FOUND");
    }

    if (draw.userId !== req.user.id) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    if (draw.status !== "COMPLETED") {
      throw new AppError("Draw not completed", 400, "DRAW_NOT_COMPLETED");
    }

    // In production, generate actual CSV/XLSX file
    const data = {
      draw: {
        id: draw.id,
        title: draw.title,
        date: draw.completedAt,
      },
      winners: draw.winners.map((winner) => ({
        position: winner.position,
        name: winner.participant.name,
        identifier: winner.participant.identifier,
        source: winner.participant.source,
      })),
    };

    res.status(200).json({
      status: "success",
      message: "Export generated successfully",
      data: {
        format,
        content: data, // In production, return file download URL
      },
    });
  },
);

/**
 * POST /api/draws/:id/video/generate
 * Queue background video generation
 */
export const queueVideoGeneration = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { id } = req.params;

    const draw = await prisma.draw.findUnique({
      where: { id },
      include: {
        participants: true,
        winners: {
          include: {
            participant: true,
          },
          orderBy: { position: "asc" },
        },
        user: {
          select: { email: true },
        },
      },
    });

    if (!draw) {
      throw new AppError("Draw not found", 404);
    }

    if (draw.userId !== req.user.id) {
      throw new AppError("Unauthorized", 403);
    }

    if (draw.status !== "COMPLETED") {
      throw new AppError("Draw must be completed to generate video", 400);
    }

    if (draw.winners.length === 0) {
      throw new AppError("Draw must have winners to generate video", 400);
    }

    // Check if a video job already exists for this draw
    const existingJob = await prisma.videoJob.findFirst({
      where: {
        drawId: id,
        status: { in: ["PENDING", "PROCESSING", "COMPLETED"] },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingJob) {
      if (existingJob.status === "COMPLETED" && existingJob.videoUrl) {
        throw new AppError(
          "Video already generated for this draw",
          409,
          "VIDEO_ALREADY_EXISTS",
        );
      }
      if (existingJob.status === "PENDING" || existingJob.status === "PROCESSING") {
        throw new AppError(
          "Video generation already in progress",
          409,
          "VIDEO_GENERATION_IN_PROGRESS",
        );
      }
    }

    // Import video service
    const { queueVideoGeneration: queueVideo } = await import("../../services/video.service");

    const { jobId } = await queueVideo({
      drawId: id,
      title: draw.title,
      participantCount: draw.participants.length,
      winners: draw.winners.map((w) => ({
        position: w.position,
        name: w.participant.name,
        username: w.participant.identifier.replace("@", ""),
      })),
      userEmail: draw.user.email,
      userId: req.user.id,
    });

    res.status(202).json({
      status: "success",
      message: "Video generation started. You will receive an email when it's ready.",
      data: {
        jobId,
        estimatedTime: "2-5 minutes",
      },
    });
  },
);

/**
 * GET /api/draws/:id/video/status/:jobId
 * Check video generation job status
 */
export const getVideoJobStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { id, jobId } = req.params;

    const { getVideoJobStatus: getStatus } = await import("../../services/video.service");

    const job = await getStatus(jobId);

    if (!job) {
      throw new AppError("Video job not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: job,
    });
  },
);

/**
 * GET /api/draws/:id/video/status
 * Get the latest video job status for a draw
 */
export const getDrawVideoStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { id } = req.params;

    // Check draw ownership
    const draw = await prisma.draw.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!draw) {
      throw new AppError("Draw not found", 404);
    }

    if (draw.userId !== req.user.id) {
      throw new AppError("Unauthorized", 403);
    }

    // Get the latest video job for this draw
    const job = await prisma.videoJob.findFirst({
      where: { drawId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        videoUrl: true,
        error: true,
        createdAt: true,
        completedAt: true,
      },
    });

    res.status(200).json({
      status: "success",
      data: job || null,
    });
  },
);
