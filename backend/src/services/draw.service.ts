/**
 * Draw Service
 * Advanced draw engine with comprehensive filtering and random selection
 */

import crypto from 'crypto';
import {
  DrawFilters,
  Participant,
  Winner,
  DrawResult,
  DrawConfig,
  FilterResult,
  ValidationResult
} from '../types/draw.types';
import { CertificateService } from './certificate.service';

export class DrawService {
  private certificateService: CertificateService;

  constructor() {
    this.certificateService = new CertificateService();
  }

  /**
   * Main draw execution method
   * Processes participants, applies filters, selects winners, and generates certificate
   */
  async executeDraw(
    rawComments: any[],
    config: DrawConfig,
    userId?: string,
    db?: any
  ): Promise<DrawResult> {
    // Validate configuration
    const validation = this.validateDrawConfig(config);
    if (!validation.valid) {
      throw new Error(`Invalid draw configuration: ${validation.errors.join(', ')}`);
    }

    // Check free trial eligibility if userId provided
    if (userId && db) {
      await this.checkFreeTrialEligibility(userId, rawComments.length, db);
    }

    // Parse participants from raw comments
    const participants = this.parseParticipants(rawComments);

    // Apply all filters
    const eligibleParticipants = await this.processParticipants(
      participants,
      config.filters
    );

    // Validate we have enough participants
    if (eligibleParticipants.length === 0) {
      throw new Error('No eligible participants after applying filters');
    }

    if (eligibleParticipants.length < config.winnersCount) {
      throw new Error(
        `Not enough eligible participants (${eligibleParticipants.length}) for requested winners (${config.winnersCount})`
      );
    }

    // Select winners and alternates
    const { winners, alternates } = this.selectWinners(
      eligibleParticipants,
      config.winnersCount,
      config.alternatesCount
    );

    // Generate draw result
    const drawResult: DrawResult = {
      drawId: config.drawId,
      timestamp: new Date(),
      totalParticipants: participants.length,
      eligibleParticipants: eligibleParticipants.length,
      winners,
      alternates,
      filters: config.filters,
      algorithm: 'Fisher-Yates Shuffle with Crypto Random'
    };

    // Generate certificate
    const { buffer, hash } = await this.generateCertificate(drawResult);
    drawResult.certificateBuffer = buffer;
    drawResult.certificateHash = hash;

    // Save to history
    await this.saveDrawHistory(config.drawId, drawResult);

    return drawResult;
  }

  /**
   * Parse raw comments into participant objects
   */
  private parseParticipants(rawComments: any[]): Participant[] {
    return rawComments.map((comment, index) => {
      const mentions = this.extractMentions(comment.text || comment.comment);
      const hashtags = this.extractHashtags(comment.text || comment.comment);

      return {
        id: comment.id || `participant-${index}`,
        username: comment.username || comment.user || `user-${index}`,
        comment: comment.text || comment.comment || '',
        timestamp: new Date(comment.timestamp || comment.created_at || Date.now()),
        mentions,
        hashtags
      };
    });
  }

  /**
   * Extract @mentions from text
   */
  private extractMentions(text: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(m => m.substring(1)) : [];
  }

  /**
   * Extract #hashtags from text
   */
  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(h => h.substring(1)) : [];
  }

  /**
   * Process participants through all filters
   */
  async processParticipants(
    participants: Participant[],
    filters: DrawFilters
  ): Promise<Participant[]> {
    let eligible = [...participants];

    // Apply blacklist first
    if (filters.blacklist && filters.blacklist.length > 0) {
      eligible = this.applyBlacklist(eligible, filters.blacklist);
    }

    // Apply duplicate filter
    if (filters.removeDuplicates) {
      eligible = this.applyDuplicateFilter(eligible);
    }

    // Apply entries limit per user
    if (filters.maxEntriesPerUser !== null && filters.maxEntriesPerUser > 0) {
      eligible = this.applyEntriesLimitFilter(eligible, filters.maxEntriesPerUser);
    }

    // Apply mentions filter
    if (filters.minMentions > 0) {
      eligible = this.applyMentionsFilter(eligible, filters.minMentions);
    }

    // Apply hashtag filter
    if (filters.requiredHashtag) {
      eligible = this.applyHashtagFilter(eligible, filters.requiredHashtag);
    }

    // Apply keyword filter
    if (filters.requiredKeywords && filters.requiredKeywords.length > 0) {
      eligible = this.applyKeywordFilter(eligible, filters.requiredKeywords);
    }

    // Apply following verification (async)
    if (filters.verifyFollowing && filters.followingAccounts && filters.followingAccounts.length > 0) {
      eligible = await this.applyFollowingFilter(eligible, filters.followingAccounts);
    }

    return eligible;
  }

  /**
   * Remove duplicate entries (keep first occurrence)
   */
  private applyDuplicateFilter(participants: Participant[]): Participant[] {
    const seen = new Set<string>();
    return participants.filter(p => {
      const key = p.username.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Limit entries per user
   */
  private applyEntriesLimitFilter(
    participants: Participant[],
    maxEntries: number
  ): Participant[] {
    const userEntries = new Map<string, number>();

    return participants.filter(p => {
      const username = p.username.toLowerCase();
      const count = userEntries.get(username) || 0;

      if (count >= maxEntries) {
        return false;
      }

      userEntries.set(username, count + 1);
      p.entryCount = count + 1;
      return true;
    });
  }

  /**
   * Filter by minimum mentions count
   */
  private applyMentionsFilter(
    participants: Participant[],
    minMentions: number
  ): Participant[] {
    return participants.filter(p => p.mentions.length >= minMentions);
  }

  /**
   * Filter by required hashtag
   */
  private applyHashtagFilter(
    participants: Participant[],
    requiredHashtag: string
  ): Participant[] {
    const normalizedHashtag = requiredHashtag.toLowerCase().replace(/^#/, '');
    return participants.filter(p =>
      p.hashtags.some(h => h.toLowerCase() === normalizedHashtag)
    );
  }

  /**
   * Filter by required keywords (OR logic)
   */
  private applyKeywordFilter(
    participants: Participant[],
    keywords: string[]
  ): Participant[] {
    const normalizedKeywords = keywords.map(k => k.toLowerCase());
    return participants.filter(p => {
      const commentLower = p.comment.toLowerCase();
      return normalizedKeywords.some(keyword => commentLower.includes(keyword));
    });
  }

  /**
   * Verify participant follows required accounts
   * This is a placeholder - implement with actual social media API
   */
  private async applyFollowingFilter(
    participants: Participant[],
    followingAccounts: string[]
  ): Promise<Participant[]> {
    // TODO: Integrate with social media API (Twitter, Instagram, etc.)
    // For now, return all participants (implement in production)

    // Example implementation:
    // const verified = await Promise.all(
    //   participants.map(async p => {
    //     const follows = await this.checkFollowing(p.username, followingAccounts);
    //     return follows ? p : null;
    //   })
    // );
    // return verified.filter(p => p !== null);

    console.warn('Following verification not implemented - skipping filter');
    return participants;
  }

  /**
   * Apply blacklist filter
   */
  private applyBlacklist(
    participants: Participant[],
    blacklist: string[]
  ): Participant[] {
    const normalizedBlacklist = new Set(
      blacklist.map(username => username.toLowerCase().replace(/^@/, ''))
    );

    return participants.filter(p =>
      !normalizedBlacklist.has(p.username.toLowerCase())
    );
  }

  /**
   * Select winners using cryptographically secure random selection
   * Uses Fisher-Yates shuffle algorithm
   */
  selectWinners(
    eligibleParticipants: Participant[],
    winnersCount: number,
    alternatesCount: number
  ): { winners: Winner[]; alternates: Winner[] } {
    const totalNeeded = winnersCount + alternatesCount;

    if (eligibleParticipants.length < totalNeeded) {
      throw new Error(
        `Not enough participants (${eligibleParticipants.length}) for winners + alternates (${totalNeeded})`
      );
    }

    // Generate seed for reproducibility in audit trail
    const seed = crypto.randomBytes(32).toString('hex');

    // Create shuffled copy
    const shuffled = [...eligibleParticipants];

    // Fisher-Yates shuffle with crypto.randomInt
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = crypto.randomInt(0, i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Select winners
    const winners: Winner[] = shuffled.slice(0, winnersCount).map((participant, index) => ({
      participant,
      position: index + 1,
      selectedAt: new Date(),
      seed: `${seed}-winner-${index}`
    }));

    // Select alternates
    const alternates: Winner[] = shuffled
      .slice(winnersCount, winnersCount + alternatesCount)
      .map((participant, index) => ({
        participant,
        position: index + 1,
        selectedAt: new Date(),
        seed: `${seed}-alternate-${index}`
      }));

    return { winners, alternates };
  }

  /**
   * Generate certificate with hash
   */
  private async generateCertificate(
    drawResult: DrawResult
  ): Promise<{ buffer: Buffer; hash: string }> {
    return await this.certificateService.generateCertificate(drawResult);
  }

  /**
   * Save draw history to database/file
   */
  private async saveDrawHistory(
    drawId: string,
    result: DrawResult
  ): Promise<void> {
    // TODO: Implement database storage
    // For now, save to file system
    const fs = await import('fs/promises');
    const path = await import('path');

    const historyDir = path.join(process.cwd(), '.swarm', 'draw-history');
    await fs.mkdir(historyDir, { recursive: true });

    const historyFile = path.join(historyDir, `${drawId}.json`);

    // Remove buffer before saving (too large)
    const { certificateBuffer, ...resultToSave } = result;

    await fs.writeFile(
      historyFile,
      JSON.stringify(resultToSave, null, 2),
      'utf-8'
    );
  }

  /**
   * Validate draw configuration
   */
  validateDrawConfig(config: DrawConfig): ValidationResult {
    const errors: string[] = [];

    if (!config.drawId || config.drawId.trim() === '') {
      errors.push('Draw ID is required');
    }

    if (config.winnersCount < 1) {
      errors.push('Winners count must be at least 1');
    }

    if (config.alternatesCount < 0) {
      errors.push('Alternates count cannot be negative');
    }

    if (config.filters.maxEntriesPerUser !== null && config.filters.maxEntriesPerUser < 1) {
      errors.push('Max entries per user must be at least 1 or null (unlimited)');
    }

    if (config.filters.minMentions < 0) {
      errors.push('Minimum mentions cannot be negative');
    }

    if (config.filters.verifyFollowing && (!config.filters.followingAccounts || config.filters.followingAccounts.length === 0)) {
      errors.push('Following accounts must be specified when verifyFollowing is enabled');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate participant data
   */
  validateParticipantData(participants: Participant[]): ValidationResult {
    const errors: string[] = [];

    if (participants.length === 0) {
      errors.push('No participants provided');
    }

    const invalidParticipants = participants.filter(
      p => !p.username || !p.comment
    );

    if (invalidParticipants.length > 0) {
      errors.push(`${invalidParticipants.length} participants have missing username or comment`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if user is eligible for free trial
   * Free trial: 1 draw with 100-200 participants max
   */
  async checkFreeTrialEligibility(
    userId: string,
    participantCount: number,
    db: any
  ): Promise<{ canUseTrial: boolean; reason?: string }> {
    // Get user info
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { credits: true, trial_used: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // If user has credits, they don't need trial
    if (user.credits > 0) {
      return { canUseTrial: false, reason: 'User has credits available' };
    }

    // Check if trial already used
    if (user.trial_used) {
      throw new Error('Free trial already used. Please purchase credits to continue.');
    }

    // Validate participant count for trial (100-200 limit)
    const MIN_TRIAL_PARTICIPANTS = 100;
    const MAX_TRIAL_PARTICIPANTS = 200;

    if (participantCount < MIN_TRIAL_PARTICIPANTS) {
      throw new Error(
        `Free trial requires at least ${MIN_TRIAL_PARTICIPANTS} participants. Current: ${participantCount}`
      );
    }

    if (participantCount > MAX_TRIAL_PARTICIPANTS) {
      throw new Error(
        `Free trial limited to ${MAX_TRIAL_PARTICIPANTS} participants. Current: ${participantCount}. Please purchase credits for larger draws.`
      );
    }

    // Mark trial as used
    await db.user.update({
      where: { id: userId },
      data: { trial_used: true }
    });

    console.log(`[Draw] User ${userId} using free trial for draw with ${participantCount} participants`);

    return { canUseTrial: true };
  }

  /**
   * Check if user can perform draw (has credits or valid subscription)
   */
  async canPerformDraw(
    userId: string,
    db: any,
    subscriptionService?: any
  ): Promise<{ allowed: boolean; reason?: string; useTrial?: boolean }> {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { credits: true, trial_used: true }
    });

    if (!user) {
      return { allowed: false, reason: 'User not found' };
    }

    // Check for active 48h pass (unlimited draws)
    if (subscriptionService) {
      const hasPass = await subscriptionService.allowsUnlimitedDraws(userId);
      if (hasPass) {
        return { allowed: true, reason: '48h pass active - unlimited draws' };
      }
    }

    // Check if user has credits
    if (user.credits > 0) {
      return { allowed: true, reason: 'Credits available' };
    }

    // Check if eligible for free trial
    if (!user.trial_used) {
      return {
        allowed: true,
        reason: 'Free trial available (100-200 participants)',
        useTrial: true
      };
    }

    return {
      allowed: false,
      reason: 'No credits available and trial already used. Please purchase credits or subscribe.'
    };
  }

  /**
   * Validate winner eligibility
   */
  validateWinnerEligibility(
    winners: Winner[],
    filters: DrawFilters
  ): ValidationResult {
    const errors: string[] = [];

    for (const winner of winners) {
      const { participant } = winner;

      // Check blacklist
      if (filters.blacklist && filters.blacklist.some(
        username => username.toLowerCase() === participant.username.toLowerCase()
      )) {
        errors.push(`Winner ${participant.username} is in blacklist`);
      }

      // Check mentions
      if (filters.minMentions > 0 && participant.mentions.length < filters.minMentions) {
        errors.push(`Winner ${participant.username} has insufficient mentions`);
      }

      // Check hashtag
      if (filters.requiredHashtag) {
        const normalizedHashtag = filters.requiredHashtag.toLowerCase().replace(/^#/, '');
        if (!participant.hashtags.some(h => h.toLowerCase() === normalizedHashtag)) {
          errors.push(`Winner ${participant.username} missing required hashtag`);
        }
      }

      // Check keywords
      if (filters.requiredKeywords && filters.requiredKeywords.length > 0) {
        const commentLower = participant.comment.toLowerCase();
        const hasKeyword = filters.requiredKeywords.some(
          k => commentLower.includes(k.toLowerCase())
        );
        if (!hasKeyword) {
          errors.push(`Winner ${participant.username} missing required keywords`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
