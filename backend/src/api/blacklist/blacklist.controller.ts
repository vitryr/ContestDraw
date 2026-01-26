/**
 * Blacklist Controller
 * Handles HTTP requests for blacklist management
 */

import { Request, Response, NextFunction } from "express";
import blacklistService from "../../services/blacklist.service";
import { logger } from "../../utils/logger";

/**
 * Get all blacklisted users
 */
export async function getBlacklist(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { platform, search } = req.query;

    const blacklist = await blacklistService.getBlacklist(userId, {
      platform: platform as string,
      search: search as string,
    });

    res.json({
      success: true,
      data: blacklist,
      count: blacklist.length,
    });
  } catch (error) {
    logger.error("Get blacklist failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}

/**
 * Add user to blacklist
 */
export async function addToBlacklist(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { username, platform, reason } = req.body;

    if (!username) {
      res.status(400).json({ error: "Username is required" });
      return;
    }

    const blacklist = await blacklistService.addToBlacklist(userId, {
      username,
      platform,
      reason,
    });

    res.status(201).json({
      success: true,
      data: blacklist,
      message: "User added to blacklist successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      res.status(409).json({ error: error.message });
      return;
    }

    logger.error("Add to blacklist failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}

/**
 * Remove user from blacklist
 */
export async function removeFromBlacklist(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;

    await blacklistService.removeFromBlacklist(userId, id);

    res.json({
      success: true,
      message: "User removed from blacklist successfully",
    });
  } catch (error) {
    logger.error("Remove from blacklist failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}

/**
 * Update blacklist entry
 */
export async function updateBlacklistEntry(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { username, platform, reason } = req.body;

    const blacklist = await blacklistService.updateBlacklistEntry(userId, id, {
      username,
      platform,
      reason,
    });

    res.json({
      success: true,
      data: blacklist,
      message: "Blacklist entry updated successfully",
    });
  } catch (error) {
    logger.error("Update blacklist entry failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}

/**
 * Bulk add users to blacklist
 */
export async function bulkAddToBlacklist(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { entries } = req.body;

    if (!Array.isArray(entries) || entries.length === 0) {
      res.status(400).json({ error: "Entries array is required" });
      return;
    }

    const result = await blacklistService.bulkAddToBlacklist(userId, entries);

    res.json({
      success: true,
      data: result,
      message: `Bulk operation completed: ${result.successCount} added, ${result.errorCount} failed`,
    });
  } catch (error) {
    logger.error("Bulk add to blacklist failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}

/**
 * Import blacklist from CSV
 */
export async function importFromCSV(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "CSV file is required" });
      return;
    }

    const result = await blacklistService.importFromCSV(
      userId,
      req.file.buffer,
    );

    res.json({
      success: true,
      data: result,
      message: `Import completed: ${result.successCount} added, ${result.errorCount} failed`,
    });
  } catch (error) {
    logger.error("CSV import failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}

/**
 * Export blacklist to CSV
 */
export async function exportToCSV(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { platform } = req.query;

    const csvBuffer = await blacklistService.exportToCSV(
      userId,
      platform as string,
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="blacklist.csv"',
    );
    res.send(csvBuffer);
  } catch (error) {
    logger.error("CSV export failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}

/**
 * Check if username is blacklisted
 */
export async function checkBlacklisted(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { username, platform } = req.query;

    if (!username) {
      res.status(400).json({ error: "Username is required" });
      return;
    }

    const isBlacklisted = await blacklistService.isBlacklisted(
      userId,
      username as string,
      (platform as string) || "INSTAGRAM",
    );

    res.json({
      success: true,
      data: {
        username,
        platform: platform || "INSTAGRAM",
        isBlacklisted,
      },
    });
  } catch (error) {
    logger.error("Check blacklisted failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}

/**
 * Get blacklist statistics
 */
export async function getBlacklistStats(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const stats = await blacklistService.getBlacklistStats(userId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error("Get blacklist stats failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}

/**
 * Clear blacklist
 */
export async function clearBlacklist(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { platform } = req.query;

    const deletedCount = await blacklistService.clearBlacklist(
      userId,
      platform as string,
    );

    res.json({
      success: true,
      data: {
        deletedCount,
      },
      message: `Cleared ${deletedCount} entries from blacklist`,
    });
  } catch (error) {
    logger.error("Clear blacklist failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}
