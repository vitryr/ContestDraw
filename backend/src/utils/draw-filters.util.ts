/**
 * Draw Filters Utility
 * Provides filtering logic for draw participants including blacklist
 */

import { Participant } from '@prisma/client';
import blacklistService from '../services/blacklist.service';
import followerVerificationService from '../services/follower-verification.service';
import logger from './logger';

interface FilterOptions {
  drawId: string;
  userId: string;
  requireFollowing?: {
    platform: 'instagram' | 'facebook';
    targetAccount: string;
    accessToken: string;
  };
  excludeBlacklisted?: boolean;
  platform?: string;
}

interface FilterResult {
  validParticipants: Participant[];
  excludedParticipants: Participant[];
  excludedReasons: Map<string, string[]>;
  summary: {
    total: number;
    valid: number;
    excluded: number;
    blacklisted: number;
    notFollowing: number;
  };
}

/**
 * Filter participants based on blacklist and follower requirements
 */
export async function filterParticipants(
  participants: Participant[],
  options: FilterOptions
): Promise<FilterResult> {
  logger.info('Filtering participants', {
    drawId: options.drawId,
    participantCount: participants.length,
    excludeBlacklisted: options.excludeBlacklisted,
    requireFollowing: !!options.requireFollowing,
  });

  const validParticipants: Participant[] = [];
  const excludedParticipants: Participant[] = [];
  const excludedReasons = new Map<string, string[]>();

  let blacklistedCount = 0;
  let notFollowingCount = 0;

  // Get blacklist entries if needed
  let blacklistedUsernames = new Set<string>();
  if (options.excludeBlacklisted) {
    const blacklist = await blacklistService.getBlacklist(options.userId, {
      platform: options.platform || 'INSTAGRAM',
    });
    blacklistedUsernames = new Set(blacklist.map((b) => b.username.toLowerCase()));
  }

  // Get follower verification results if needed
  let followerMap = new Map<string, boolean>();
  if (options.requireFollowing) {
    const verificationResults = await followerVerificationService.filterVerifiedFollowers(
      options.drawId,
      participants.map((p) => ({ username: p.identifier }))
    );
    followerMap = new Map(
      verificationResults.map((v) => [v.username.toLowerCase(), v.isFollowing])
    );
  }

  // Filter each participant
  for (const participant of participants) {
    const reasons: string[] = [];
    const username = participant.identifier.toLowerCase();

    // Check blacklist
    if (options.excludeBlacklisted && blacklistedUsernames.has(username)) {
      reasons.push('blacklisted');
      blacklistedCount++;
    }

    // Check follower requirement
    if (options.requireFollowing) {
      const isFollowing = followerMap.get(username);
      if (isFollowing === false) {
        reasons.push('not_following');
        notFollowingCount++;
      }
    }

    // Add to appropriate list
    if (reasons.length > 0) {
      excludedParticipants.push(participant);
      excludedReasons.set(participant.id, reasons);
    } else {
      validParticipants.push(participant);
    }
  }

  const result: FilterResult = {
    validParticipants,
    excludedParticipants,
    excludedReasons,
    summary: {
      total: participants.length,
      valid: validParticipants.length,
      excluded: excludedParticipants.length,
      blacklisted: blacklistedCount,
      notFollowing: notFollowingCount,
    },
  };

  logger.info('Participant filtering completed', {
    drawId: options.drawId,
    ...result.summary,
  });

  return result;
}

/**
 * Validate participants before draw execution
 */
export async function validateParticipantsForDraw(
  drawId: string,
  userId: string,
  participants: Participant[],
  options?: {
    requireFollowing?: FilterOptions['requireFollowing'];
    excludeBlacklisted?: boolean;
    platform?: string;
  }
): Promise<{
  isValid: boolean;
  errors: string[];
  warnings: string[];
  validParticipantCount: number;
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Minimum participants check
  if (participants.length === 0) {
    errors.push('No participants found for draw');
  }

  // Filter participants
  const filterResult = await filterParticipants(participants, {
    drawId,
    userId,
    requireFollowing: options?.requireFollowing,
    excludeBlacklisted: options?.excludeBlacklisted,
    platform: options?.platform,
  });

  // Check if enough valid participants remain
  if (filterResult.validParticipants.length === 0) {
    errors.push('No valid participants remain after filtering');
  } else if (filterResult.validParticipants.length < 2) {
    warnings.push('Only one valid participant found');
  }

  // Add warnings for excluded participants
  if (filterResult.summary.blacklisted > 0) {
    warnings.push(
      `${filterResult.summary.blacklisted} participant(s) excluded due to blacklist`
    );
  }

  if (filterResult.summary.notFollowing > 0) {
    warnings.push(
      `${filterResult.summary.notFollowing} participant(s) excluded for not following required account`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    validParticipantCount: filterResult.validParticipants.length,
  };
}

/**
 * Get excluded participant report
 */
export function generateExcludedReport(filterResult: FilterResult): string {
  const lines: string[] = [
    '=== Excluded Participants Report ===',
    `Total Participants: ${filterResult.summary.total}`,
    `Valid Participants: ${filterResult.summary.valid}`,
    `Excluded Participants: ${filterResult.summary.excluded}`,
    '',
    'Exclusion Breakdown:',
    `- Blacklisted: ${filterResult.summary.blacklisted}`,
    `- Not Following: ${filterResult.summary.notFollowing}`,
    '',
  ];

  if (filterResult.excludedParticipants.length > 0) {
    lines.push('Excluded Participants:');
    for (const participant of filterResult.excludedParticipants) {
      const reasons = filterResult.excludedReasons.get(participant.id) || [];
      lines.push(`- ${participant.identifier} (${reasons.join(', ')})`);
    }
  }

  return lines.join('\n');
}

/**
 * Apply filters and update participant list for draw
 */
export async function applyFiltersAndUpdateDraw(
  drawId: string,
  userId: string,
  options?: {
    requireFollowing?: FilterOptions['requireFollowing'];
    excludeBlacklisted?: boolean;
    platform?: string;
  }
): Promise<FilterResult> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // Get all participants for the draw
    const participants = await prisma.participant.findMany({
      where: { drawId },
    });

    // Apply filters
    const filterResult = await filterParticipants(participants, {
      drawId,
      userId,
      requireFollowing: options?.requireFollowing,
      excludeBlacklisted: options?.excludeBlacklisted,
      platform: options?.platform,
    });

    // Optionally mark excluded participants in metadata
    for (const participant of filterResult.excludedParticipants) {
      const reasons = filterResult.excludedReasons.get(participant.id) || [];
      await prisma.participant.update({
        where: { id: participant.id },
        data: {
          metadata: {
            ...(participant.metadata as object),
            excluded: true,
            excludedReasons: reasons,
            excludedAt: new Date().toISOString(),
          },
        },
      });
    }

    logger.info('Filters applied and draw updated', {
      drawId,
      ...filterResult.summary,
    });

    return filterResult;
  } finally {
    await prisma.$disconnect();
  }
}
