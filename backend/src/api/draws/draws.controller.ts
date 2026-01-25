import { Response } from 'express';
import crypto from 'crypto';
import { AuthRequest, DrawStatus, DrawParticipant, DrawResult, PaginatedResponse } from '../../types';
import { asyncHandler, AppError } from '../../middleware/error.middleware';
import { logger } from '../../utils/logger';
import { selectWinners } from '../../services/random.service';
import { generateCertificatePDF } from '../../services/certificate.service';

// Mock database
const draws = new Map<string, any>();

/**
 * POST /api/draws
 * Create a new draw
 */
export const createDraw = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const {
    title,
    description,
    numberOfWinners,
    participants,
    allowDuplicates,
    status,
    platform,
    postUrl
  } = req.body;

  // For draft draws, participants are optional
  const isDraft = status === 'draft' || !participants || participants.length === 0;

  // Validate number of winners only if participants are provided
  if (participants && participants.length > 0) {
    if (numberOfWinners > participants.length && !allowDuplicates) {
      throw new AppError('Number of winners cannot exceed number of participants', 400, 'INVALID_WINNERS_COUNT');
    }
  }

  const drawId = crypto.randomUUID();
  const draw = {
    id: drawId,
    userId: req.user.id,
    title,
    description: description || null,
    numberOfWinners,
    participants: participants && participants.length > 0
      ? participants.map((p: any) => ({
          id: crypto.randomUUID(),
          name: p.name,
          identifier: p.identifier,
          source: p.source || 'MANUAL',
          metadata: p.metadata || {}
        }))
      : [],
    allowDuplicates: allowDuplicates || false,
    status: isDraft ? DrawStatus.DRAFT : DrawStatus.READY,
    platform: platform || null,
    postUrl: postUrl || null,
    result: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  draws.set(drawId, draw);

  logger.info(`Draw created: ${drawId} by user ${req.user.id} (status: ${draw.status})`);

  res.status(201).json({
    status: 'success',
    message: 'Draw created successfully',
    data: { draw }
  });
});

/**
 * GET /api/draws
 * List user draws with pagination
 */
export const listDraws = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string | undefined;
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

  // In production, fetch from database with filters
  const userDraws = Array.from(draws.values()).filter(d => d.userId === req.user!.id);

  const response: PaginatedResponse<any> = {
    data: userDraws.slice((page - 1) * limit, page * limit),
    meta: {
      total: userDraws.length,
      page,
      limit,
      totalPages: Math.ceil(userDraws.length / limit)
    }
  };

  res.status(200).json({
    status: 'success',
    ...response
  });
});

/**
 * GET /api/draws/:id
 * Get draw details
 */
export const getDrawById = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;
  const draw = draws.get(id);

  if (!draw) {
    throw new AppError('Draw not found', 404, 'DRAW_NOT_FOUND');
  }

  if (draw.userId !== req.user.id) {
    throw new AppError('Access denied', 403, 'ACCESS_DENIED');
  }

  res.status(200).json({
    status: 'success',
    data: { draw }
  });
});

/**
 * DELETE /api/draws/:id
 * Delete a draw
 */
export const deleteDraw = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;
  const draw = draws.get(id);

  if (!draw) {
    throw new AppError('Draw not found', 404, 'DRAW_NOT_FOUND');
  }

  if (draw.userId !== req.user.id) {
    throw new AppError('Access denied', 403, 'ACCESS_DENIED');
  }

  draws.delete(id);

  logger.info(`Draw deleted: ${id} by user ${req.user.id}`);

  res.status(200).json({
    status: 'success',
    message: 'Draw deleted successfully'
  });
});

/**
 * POST /api/draws/:id/execute
 * Execute the draw algorithm
 */
export const executeDraw = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;
  const { algorithm = 'crypto-random', seed } = req.body;

  const draw = draws.get(id);

  if (!draw) {
    throw new AppError('Draw not found', 404, 'DRAW_NOT_FOUND');
  }

  if (draw.userId !== req.user.id) {
    throw new AppError('Access denied', 403, 'ACCESS_DENIED');
  }

  if (draw.status === DrawStatus.COMPLETED) {
    throw new AppError('Draw already executed', 400, 'DRAW_ALREADY_EXECUTED');
  }

  // Update status to processing
  draw.status = DrawStatus.PROCESSING;

  try {
    // Execute random selection
    const winners = selectWinners(
      draw.participants,
      draw.numberOfWinners,
      draw.allowDuplicates,
      seed
    );

    // Generate certificate hash
    const certificateData = JSON.stringify({
      drawId: draw.id,
      winners: winners.map(w => w.id),
      timestamp: new Date().toISOString(),
      algorithm,
      seed: seed || 'auto-generated'
    });
    const certificateHash = crypto.createHash('sha256').update(certificateData).digest('hex');

    // Create result
    const result: DrawResult = {
      winners,
      timestamp: new Date(),
      algorithm,
      seed: seed || 'auto-generated',
      certificateHash
    };

    draw.result = result;
    draw.status = DrawStatus.COMPLETED;
    draw.completedAt = new Date();

    // Deduct credits (in production)
    logger.info(`Draw executed: ${id} by user ${req.user.id}`);

    res.status(200).json({
      status: 'success',
      message: 'Draw executed successfully',
      data: {
        draw,
        result
      }
    });
  } catch (error: any) {
    draw.status = DrawStatus.FAILED;
    logger.error(`Draw execution failed: ${id}`, error);
    throw new AppError('Draw execution failed', 500, 'EXECUTION_FAILED');
  }
});

/**
 * GET /api/draws/:id/certificate
 * Generate certificate PDF
 */
export const generateCertificate = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;
  const draw = draws.get(id);

  if (!draw) {
    throw new AppError('Draw not found', 404, 'DRAW_NOT_FOUND');
  }

  if (draw.userId !== req.user.id) {
    throw new AppError('Access denied', 403, 'ACCESS_DENIED');
  }

  if (draw.status !== DrawStatus.COMPLETED || !draw.result) {
    throw new AppError('Draw not completed', 400, 'DRAW_NOT_COMPLETED');
  }

  // Generate PDF
  const pdfBuffer = await generateCertificatePDF(draw);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="draw-${id}-certificate.pdf"`);
  res.send(pdfBuffer);
});

/**
 * POST /api/draws/:id/export
 * Export draw results to CSV/XLS
 */
export const exportResults = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;
  const { format } = req.body;

  const draw = draws.get(id);

  if (!draw) {
    throw new AppError('Draw not found', 404, 'DRAW_NOT_FOUND');
  }

  if (draw.userId !== req.user.id) {
    throw new AppError('Access denied', 403, 'ACCESS_DENIED');
  }

  if (draw.status !== DrawStatus.COMPLETED || !draw.result) {
    throw new AppError('Draw not completed', 400, 'DRAW_NOT_COMPLETED');
  }

  // In production, generate actual CSV/XLSX file
  const data = {
    draw: {
      id: draw.id,
      title: draw.title,
      date: draw.completedAt
    },
    winners: draw.result.winners.map((w: DrawParticipant, index: number) => ({
      position: index + 1,
      name: w.name,
      identifier: w.identifier,
      source: w.source
    }))
  };

  res.status(200).json({
    status: 'success',
    message: 'Export generated successfully',
    data: {
      format,
      content: data // In production, return file download URL
    }
  });
});
