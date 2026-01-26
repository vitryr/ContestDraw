/**
 * Blacklist Service
 * Manages user blacklist for excluding usernames from draws
 * Provides CRUD operations and CSV import/export functionality
 */

import { PrismaClient, Blacklist } from "@prisma/client";
import * as XLSX from "xlsx";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

interface BlacklistEntry {
  id?: string;
  username: string;
  platform: string;
  reason?: string;
}

interface BlacklistCreateInput {
  username: string;
  platform?: string;
  reason?: string;
}

interface BlacklistFilter {
  platform?: string;
  search?: string;
}

export class BlacklistService {
  /**
   * Add user to blacklist
   */
  async addToBlacklist(
    userId: string,
    entry: BlacklistCreateInput,
  ): Promise<Blacklist> {
    try {
      const blacklist = await prisma.blacklist.create({
        data: {
          userId,
          username: entry.username.toLowerCase(),
          platform: entry.platform || "INSTAGRAM",
          reason: entry.reason,
        },
      });

      logger.info("User added to blacklist", {
        userId,
        username: entry.username,
        platform: entry.platform,
      });

      return blacklist;
    } catch (error) {
      // Handle unique constraint violation
      if (error instanceof Error && "code" in error && error.code === "P2002") {
        throw new Error("User already exists in blacklist");
      }

      logger.error("Failed to add user to blacklist", {
        userId,
        username: entry.username,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }

  /**
   * Remove user from blacklist
   */
  async removeFromBlacklist(
    userId: string,
    blacklistId: string,
  ): Promise<void> {
    try {
      await prisma.blacklist.delete({
        where: {
          id: blacklistId,
          userId,
        },
      });

      logger.info("User removed from blacklist", {
        userId,
        blacklistId,
      });
    } catch (error) {
      logger.error("Failed to remove user from blacklist", {
        userId,
        blacklistId,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }

  /**
   * Get all blacklisted users for a user
   */
  async getBlacklist(
    userId: string,
    filter?: BlacklistFilter,
  ): Promise<Blacklist[]> {
    try {
      const where: any = { userId };

      if (filter?.platform) {
        where.platform = filter.platform;
      }

      if (filter?.search) {
        where.username = {
          contains: filter.search.toLowerCase(),
        };
      }

      const blacklist = await prisma.blacklist.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return blacklist;
    } catch (error) {
      logger.error("Failed to get blacklist", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }

  /**
   * Check if username is blacklisted
   */
  async isBlacklisted(
    userId: string,
    username: string,
    platform: string = "INSTAGRAM",
  ): Promise<boolean> {
    try {
      const entry = await prisma.blacklist.findFirst({
        where: {
          userId,
          username: username.toLowerCase(),
          platform,
        },
      });

      return !!entry;
    } catch (error) {
      logger.error("Failed to check blacklist", {
        userId,
        username,
        error: error instanceof Error ? error.message : String(error),
      });

      return false;
    }
  }

  /**
   * Update blacklist entry
   */
  async updateBlacklistEntry(
    userId: string,
    blacklistId: string,
    updates: Partial<BlacklistCreateInput>,
  ): Promise<Blacklist> {
    try {
      const blacklist = await prisma.blacklist.update({
        where: {
          id: blacklistId,
          userId,
        },
        data: {
          ...(updates.username && { username: updates.username.toLowerCase() }),
          ...(updates.platform && { platform: updates.platform }),
          ...(updates.reason !== undefined && { reason: updates.reason }),
        },
      });

      logger.info("Blacklist entry updated", {
        userId,
        blacklistId,
      });

      return blacklist;
    } catch (error) {
      logger.error("Failed to update blacklist entry", {
        userId,
        blacklistId,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }

  /**
   * Bulk add users to blacklist
   */
  async bulkAddToBlacklist(
    userId: string,
    entries: BlacklistCreateInput[],
  ): Promise<{ successCount: number; errorCount: number; errors: string[] }> {
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const entry of entries) {
      try {
        await this.addToBlacklist(userId, entry);
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(
          `Failed to add ${entry.username}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }

    logger.info("Bulk blacklist operation completed", {
      userId,
      totalEntries: entries.length,
      successCount,
      errorCount,
    });

    return { successCount, errorCount, errors };
  }

  /**
   * Import blacklist from CSV
   */
  async importFromCSV(
    userId: string,
    csvBuffer: Buffer,
  ): Promise<{ successCount: number; errorCount: number; errors: string[] }> {
    try {
      // Parse CSV using xlsx
      const workbook = XLSX.read(csvBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json<any>(worksheet);

      // Validate and transform data
      const entries: BlacklistCreateInput[] = data.map((row) => ({
        username: row.username || row.Username || row.USERNAME || "",
        platform: row.platform || row.Platform || row.PLATFORM || "INSTAGRAM",
        reason: row.reason || row.Reason || row.REASON || undefined,
      }));

      // Filter out invalid entries
      const validEntries = entries.filter(
        (entry) => entry.username && entry.username.trim() !== "",
      );

      if (validEntries.length === 0) {
        throw new Error("No valid entries found in CSV file");
      }

      // Bulk add to blacklist
      const result = await this.bulkAddToBlacklist(userId, validEntries);

      logger.info("CSV import completed", {
        userId,
        totalRows: data.length,
        validEntries: validEntries.length,
        ...result,
      });

      return result;
    } catch (error) {
      logger.error("Failed to import CSV", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }

  /**
   * Export blacklist to CSV
   */
  async exportToCSV(userId: string, platform?: string): Promise<Buffer> {
    try {
      const filter: BlacklistFilter = platform ? { platform } : undefined;
      const blacklist = await this.getBlacklist(userId, filter);

      // Transform data for CSV export
      const data = blacklist.map((entry) => ({
        Username: entry.username,
        Platform: entry.platform,
        Reason: entry.reason || "",
        "Added Date": entry.createdAt.toISOString(),
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Blacklist");

      // Generate CSV buffer
      const csvBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "csv",
      });

      logger.info("CSV export completed", {
        userId,
        entryCount: blacklist.length,
      });

      return csvBuffer;
    } catch (error) {
      logger.error("Failed to export CSV", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }

  /**
   * Filter participants by blacklist
   */
  async filterParticipants(
    userId: string,
    participants: Array<{ username: string; platform?: string }>,
    platform: string = "INSTAGRAM",
  ): Promise<Array<{ username: string; isBlacklisted: boolean }>> {
    try {
      // Get all blacklisted usernames for the platform
      const blacklist = await prisma.blacklist.findMany({
        where: {
          userId,
          platform,
        },
        select: {
          username: true,
        },
      });

      const blacklistedUsernames = new Set(
        blacklist.map((entry) => entry.username.toLowerCase()),
      );

      // Check each participant
      return participants.map((participant) => ({
        username: participant.username,
        isBlacklisted: blacklistedUsernames.has(
          participant.username.toLowerCase(),
        ),
      }));
    } catch (error) {
      logger.error("Failed to filter participants", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }

  /**
   * Get blacklist statistics
   */
  async getBlacklistStats(userId: string): Promise<{
    totalCount: number;
    byPlatform: Record<string, number>;
  }> {
    try {
      const blacklist = await prisma.blacklist.findMany({
        where: { userId },
        select: {
          platform: true,
        },
      });

      const byPlatform: Record<string, number> = {};
      for (const entry of blacklist) {
        byPlatform[entry.platform] = (byPlatform[entry.platform] || 0) + 1;
      }

      return {
        totalCount: blacklist.length,
        byPlatform,
      };
    } catch (error) {
      logger.error("Failed to get blacklist stats", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }

  /**
   * Clear all blacklist entries
   */
  async clearBlacklist(userId: string, platform?: string): Promise<number> {
    try {
      const where: any = { userId };

      if (platform) {
        where.platform = platform;
      }

      const result = await prisma.blacklist.deleteMany({
        where,
      });

      logger.info("Blacklist cleared", {
        userId,
        platform,
        deletedCount: result.count,
      });

      return result.count;
    } catch (error) {
      logger.error("Failed to clear blacklist", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }
}

export default new BlacklistService();
