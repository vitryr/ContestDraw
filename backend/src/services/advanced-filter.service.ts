/**
 * Advanced Filter Service
 * Applies all filters to participants with full audit trail
 */

import {
  AdvancedDrawFilters,
  DEFAULT_FILTERS,
  ParticipantFilterResult,
  BatchFilterResult,
  FilterCategory,
  LinkedAccountGroup,
} from '../types/advanced-filters.types';
import { SourceCapabilities } from '../types/filter-capabilities.types';
import { logger } from '../utils/logger';

/**
 * Extended participant data for filtering
 */
export interface ExtendedParticipant {
  id: string;
  username: string;
  comment: string;
  timestamp?: Date;
  mentions: string[];
  hashtags: string[];
  isReply?: boolean;
  likeCount?: number;
  
  // Profile data (if available)
  profile?: {
    bio?: string;
    hasProfilePicture?: boolean;
    followerCount?: number;
    followingCount?: number;
    postsCount?: number;
    accountAge?: number;  // In days
    isVerified?: boolean;
  };
}

class AdvancedFilterService {
  /**
   * Apply all filters to a batch of participants
   */
  async applyFilters(
    participants: ExtendedParticipant[],
    filters: Partial<AdvancedDrawFilters>,
    capabilities: SourceCapabilities
  ): Promise<BatchFilterResult> {
    const startTime = Date.now();
    const mergedFilters = this.mergeWithDefaults(filters);
    
    logger.info('Applying filters to participants', {
      count: participants.length,
      filters: Object.keys(filters),
    });

    const results: ParticipantFilterResult[] = [];
    const summaryByFilter: Record<string, number> = {};
    const summaryByCategory: Record<FilterCategory, number> = {
      participation: 0,
      mentions: 0,
      keywords: 0,
      multiComment: 0,
      profile: 0,
      antiBot: 0,
      followVerification: 0,
    };

    // Pre-process: Build lookup maps for efficiency
    const blacklistSet = new Set(
      mergedFilters.antiBot.blacklist.map(u => u.toLowerCase())
    );
    const linkedAccountsMap = this.buildLinkedAccountsMap(
      mergedFilters.antiBot.linkedAccounts
    );

    // Group by username for multi-comment handling
    const participantsByUsername = this.groupByUsername(participants);

    // Apply filters to each participant group
    for (const [username, userParticipants] of participantsByUsername.entries()) {
      // First, apply individual filters to each comment
      const individualResults = userParticipants.map(p => 
        this.filterSingleParticipant(p, mergedFilters, capabilities, blacklistSet)
      );

      // Then, apply multi-comment rules
      const processedResults = this.applyMultiCommentRules(
        username,
        userParticipants,
        individualResults,
        mergedFilters,
        linkedAccountsMap
      );

      results.push(...processedResults);

      // Update summary
      for (const result of processedResults) {
        for (const failedFilter of result.failedFilters) {
          const category = this.getFilterCategory(failedFilter);
          if (category) {
            summaryByCategory[category]++;
          }
          summaryByFilter[failedFilter] = (summaryByFilter[failedFilter] || 0) + 1;
        }
      }
    }

    // Apply similar username detection across all participants
    if (mergedFilters.antiBot.excludeSimilarUsernames.enabled) {
      this.applySimilarUsernameFilter(
        results,
        mergedFilters.antiBot.excludeSimilarUsernames
      );
    }

    const passed = results.filter(r => r.passed).length;
    const excluded = results.filter(r => !r.passed).length;

    const batchResult: BatchFilterResult = {
      totalProcessed: results.length,
      passed,
      excluded,
      results,
      summary: {
        byFilter: summaryByFilter,
        byCategory: summaryByCategory,
      },
      processingTimeMs: Date.now() - startTime,
    };

    logger.info('Filter processing complete', {
      total: batchResult.totalProcessed,
      passed: batchResult.passed,
      excluded: batchResult.excluded,
      processingTimeMs: batchResult.processingTimeMs,
    });

    return batchResult;
  }

  /**
   * Filter a single participant
   */
  private filterSingleParticipant(
    participant: ExtendedParticipant,
    filters: AdvancedDrawFilters,
    capabilities: SourceCapabilities,
    blacklistSet: Set<string>
  ): ParticipantFilterResult {
    const failedFilters: string[] = [];
    const warnings: string[] = [];

    // === PARTICIPATION FILTERS ===
    
    // Require comment
    if (filters.participation.requireComment && !participant.comment?.trim()) {
      failedFilters.push('participation.requireComment');
    }

    // Reply handling
    if (capabilities.hasReplyInfo && participant.isReply !== undefined) {
      if (filters.participation.replyHandling === 'exclude' && participant.isReply) {
        failedFilters.push('participation.replyHandling');
      }
      if (filters.participation.replyHandling === 'only_replies' && !participant.isReply) {
        failedFilters.push('participation.replyHandling');
      }
    }

    // Date range
    if (filters.participation.dateRange && participant.timestamp) {
      const ts = new Date(participant.timestamp);
      if (filters.participation.dateRange.from && ts < new Date(filters.participation.dateRange.from)) {
        failedFilters.push('participation.dateRange');
      }
      if (filters.participation.dateRange.to && ts > new Date(filters.participation.dateRange.to)) {
        failedFilters.push('participation.dateRange');
      }
    }

    // === MENTIONS FILTERS ===
    
    const mentions = this.extractMentions(participant.comment);
    let effectiveMentions = mentions;

    // Unique mentions only
    if (filters.mentions.uniqueMentionsOnly) {
      effectiveMentions = [...new Set(mentions.map(m => m.toLowerCase()))];
    }

    // Min mentions
    if (filters.mentions.minMentions > 0) {
      if (effectiveMentions.length < filters.mentions.minMentions) {
        failedFilters.push('mentions.minMentions');
      }
    }

    // Exclude auto-mention
    if (filters.mentions.excludeAutoMention) {
      const usernameLower = participant.username.toLowerCase();
      if (effectiveMentions.some(m => m.toLowerCase() === usernameLower)) {
        failedFilters.push('mentions.excludeAutoMention');
      }
    }

    // Required mentions
    if (filters.mentions.requiredMentions && filters.mentions.requiredMentions.length > 0) {
      const mentionsLower = effectiveMentions.map(m => m.toLowerCase());
      const requiredLower = filters.mentions.requiredMentions.map(m => m.toLowerCase().replace('@', ''));
      const allRequired = requiredLower.every(r => mentionsLower.includes(r));
      if (!allRequired) {
        failedFilters.push('mentions.requiredMentions');
      }
    }

    // === KEYWORDS FILTERS ===
    
    const commentLower = (participant.comment || '').toLowerCase();

    // Required keywords
    if (filters.keywords.required.length > 0) {
      const requiredKeywords = filters.keywords.required.map(k => 
        filters.keywords.caseSensitive ? k : k.toLowerCase()
      );
      const textToCheck = filters.keywords.caseSensitive ? participant.comment : commentLower;

      if (filters.keywords.requiredMode === 'all') {
        const hasAll = requiredKeywords.every(k => textToCheck.includes(k));
        if (!hasAll) failedFilters.push('keywords.required');
      } else {
        const hasAny = requiredKeywords.some(k => textToCheck.includes(k));
        if (!hasAny) failedFilters.push('keywords.required');
      }
    }

    // Forbidden keywords
    if (filters.keywords.forbidden.length > 0) {
      const forbiddenKeywords = filters.keywords.forbidden.map(k => 
        filters.keywords.caseSensitive ? k : k.toLowerCase()
      );
      const textToCheck = filters.keywords.caseSensitive ? participant.comment : commentLower;
      
      if (forbiddenKeywords.some(k => textToCheck.includes(k))) {
        failedFilters.push('keywords.forbidden');
      }
    }

    // === PROFILE FILTERS ===
    
    if (participant.profile) {
      // Require bio
      if (filters.profile.requireBio.enabled) {
        const bioLength = participant.profile.bio?.length || 0;
        if (bioLength < filters.profile.requireBio.minLength) {
          failedFilters.push('profile.requireBio');
        }
      }

      // Require profile picture
      if (filters.profile.requireProfilePicture && !participant.profile.hasProfilePicture) {
        failedFilters.push('profile.requireProfilePicture');
      }

      // Min account age
      if (filters.profile.minAccountAge !== null) {
        if (!participant.profile.accountAge || participant.profile.accountAge < filters.profile.minAccountAge) {
          failedFilters.push('profile.minAccountAge');
        }
      }

      // Min posts
      if (filters.profile.minPosts !== null) {
        if (!participant.profile.postsCount || participant.profile.postsCount < filters.profile.minPosts) {
          failedFilters.push('profile.minPosts');
        }
      }

      // Max followings
      if (filters.profile.maxFollowings !== null) {
        if (participant.profile.followingCount && participant.profile.followingCount > filters.profile.maxFollowings) {
          failedFilters.push('profile.maxFollowings');
        }
      }

      // Min followers
      if (filters.profile.minFollowers !== null) {
        if (!participant.profile.followerCount || participant.profile.followerCount < filters.profile.minFollowers) {
          failedFilters.push('profile.minFollowers');
        }
      }

      // Require verified
      if (filters.profile.requireVerified && !participant.profile.isVerified) {
        failedFilters.push('profile.requireVerified');
      }

      // Bio forbidden words
      if (filters.profile.bioForbiddenWords.length > 0 && participant.profile.bio) {
        const bioLower = participant.profile.bio.toLowerCase();
        if (filters.profile.bioForbiddenWords.some(w => bioLower.includes(w.toLowerCase()))) {
          failedFilters.push('profile.bioForbiddenWords');
        }
      }
    }

    // === ANTI-BOT FILTERS ===
    
    // Blacklist
    if (blacklistSet.has(participant.username.toLowerCase())) {
      failedFilters.push('antiBot.blacklist');
    }

    // Exclude patterns
    if (filters.antiBot.excludePatterns.length > 0) {
      for (const pattern of filters.antiBot.excludePatterns) {
        try {
          const regex = new RegExp(pattern, 'i');
          if (regex.test(participant.username)) {
            failedFilters.push('antiBot.excludePatterns');
            break;
          }
        } catch (e) {
          warnings.push(`Invalid regex pattern: ${pattern}`);
        }
      }
    }

    return {
      participantId: participant.id,
      username: participant.username,
      passed: failedFilters.length === 0,
      failedFilters,
      warnings,
      entriesCount: 1,
      bonusMultiplier: 1,
    };
  }

  /**
   * Apply multi-comment rules to a user's entries
   */
  private applyMultiCommentRules(
    username: string,
    participants: ExtendedParticipant[],
    individualResults: ParticipantFilterResult[],
    filters: AdvancedDrawFilters,
    linkedAccountsMap: Map<string, string>
  ): ParticipantFilterResult[] {
    // Only keep entries that passed individual filters
    const passedIndices = individualResults
      .map((r, i) => r.passed ? i : -1)
      .filter(i => i >= 0);

    if (passedIndices.length === 0) {
      return individualResults;
    }

    let keptIndices: number[] = [];

    // Check for linked accounts
    const primaryUsername = linkedAccountsMap.get(username.toLowerCase());
    if (primaryUsername) {
      // This is a linked account - mark as failed
      return individualResults.map(r => ({
        ...r,
        passed: false,
        failedFilters: [...r.failedFilters, 'antiBot.linkedAccounts'],
      }));
    }

    // Remove duplicate comments if enabled
    if (filters.multiComment.removeDuplicateComments) {
      const seenComments = new Set<string>();
      const uniqueIndices: number[] = [];
      
      for (const idx of passedIndices) {
        const commentKey = participants[idx].comment.toLowerCase().trim();
        if (!seenComments.has(commentKey)) {
          seenComments.add(commentKey);
          uniqueIndices.push(idx);
        }
      }
      keptIndices = uniqueIndices;
    } else {
      keptIndices = passedIndices;
    }

    // Apply max entries per user
    if (filters.multiComment.maxEntriesPerUser !== null) {
      // If allow different mentions is enabled, check mentions
      if (filters.multiComment.allowIfDifferentMentions) {
        const mentionGroups = new Map<string, number[]>();
        
        for (const idx of keptIndices) {
          const mentions = this.extractMentions(participants[idx].comment)
            .map(m => m.toLowerCase())
            .sort()
            .join(',');
          
          if (!mentionGroups.has(mentions)) {
            mentionGroups.set(mentions, []);
          }
          mentionGroups.get(mentions)!.push(idx);
        }

        // Keep one entry per unique mention combination
        const finalIndices: number[] = [];
        for (const [, indices] of mentionGroups.entries()) {
          const toKeep = this.selectComment(
            indices.map(i => participants[i]),
            filters.multiComment.commentSelection
          );
          if (toKeep !== undefined) {
            finalIndices.push(indices[toKeep]);
          }
        }

        // Still apply max entries limit
        keptIndices = finalIndices.slice(0, filters.multiComment.maxEntriesPerUser);
      } else {
        // Simple limit
        if (keptIndices.length > filters.multiComment.maxEntriesPerUser) {
          const selectedIdx = this.selectComment(
            keptIndices.map(i => participants[i]),
            filters.multiComment.commentSelection
          );
          keptIndices = selectedIdx !== undefined ? [keptIndices[selectedIdx]] : [];
        }
      }
    }

    // Update results
    const keptSet = new Set(keptIndices);
    return individualResults.map((result, idx) => {
      if (result.passed && !keptSet.has(idx)) {
        return {
          ...result,
          passed: false,
          failedFilters: [...result.failedFilters, 'multiComment.maxEntriesPerUser'],
        };
      }
      return {
        ...result,
        entriesCount: keptIndices.indexOf(idx) >= 0 ? 1 : 0,
      };
    });
  }

  /**
   * Select which comment to keep based on selection mode
   */
  private selectComment(
    participants: ExtendedParticipant[],
    mode: 'first' | 'last' | 'random'
  ): number | undefined {
    if (participants.length === 0) return undefined;
    
    switch (mode) {
      case 'first':
        // Sort by timestamp ascending, return first
        const sortedFirst = [...participants]
          .map((p, i) => ({ p, i }))
          .sort((a, b) => {
            if (!a.p.timestamp || !b.p.timestamp) return 0;
            return new Date(a.p.timestamp).getTime() - new Date(b.p.timestamp).getTime();
          });
        return sortedFirst[0]?.i ?? 0;
        
      case 'last':
        // Sort by timestamp descending, return first
        const sortedLast = [...participants]
          .map((p, i) => ({ p, i }))
          .sort((a, b) => {
            if (!a.p.timestamp || !b.p.timestamp) return 0;
            return new Date(b.p.timestamp).getTime() - new Date(a.p.timestamp).getTime();
          });
        return sortedLast[0]?.i ?? 0;
        
      case 'random':
        return Math.floor(Math.random() * participants.length);
        
      default:
        return 0;
    }
  }

  /**
   * Apply similar username detection
   */
  private applySimilarUsernameFilter(
    results: ParticipantFilterResult[],
    config: { enabled: boolean; mode: 'standard' | 'strict'; threshold: number }
  ): void {
    const usernames = results
      .filter(r => r.passed)
      .map(r => r.username.toLowerCase());

    // Build clusters of similar usernames
    const clusters: Set<string>[] = [];
    
    for (let i = 0; i < usernames.length; i++) {
      for (let j = i + 1; j < usernames.length; j++) {
        const similarity = this.calculateSimilarity(usernames[i], usernames[j], config.mode);
        
        if (similarity >= config.threshold) {
          // Find or create cluster
          let foundCluster = false;
          for (const cluster of clusters) {
            if (cluster.has(usernames[i]) || cluster.has(usernames[j])) {
              cluster.add(usernames[i]);
              cluster.add(usernames[j]);
              foundCluster = true;
              break;
            }
          }
          if (!foundCluster) {
            clusters.push(new Set([usernames[i], usernames[j]]));
          }
        }
      }
    }

    // Mark similar usernames as failed (keep one per cluster)
    for (const cluster of clusters) {
      const clusterArray = Array.from(cluster);
      // Keep the first one, mark others as failed
      for (let i = 1; i < clusterArray.length; i++) {
        const result = results.find(r => r.username.toLowerCase() === clusterArray[i]);
        if (result && result.passed) {
          result.passed = false;
          result.failedFilters.push('antiBot.excludeSimilarUsernames');
        }
      }
    }
  }

  /**
   * Calculate similarity between two usernames
   */
  private calculateSimilarity(a: string, b: string, mode: 'standard' | 'strict'): number {
    // Remove common prefixes/suffixes
    const cleanA = a.replace(/^[@_.]|[_.\d]+$/g, '');
    const cleanB = b.replace(/^[@_.]|[_.\d]+$/g, '');
    
    if (mode === 'strict') {
      // Levenshtein distance based similarity
      return 1 - (this.levenshteinDistance(cleanA, cleanB) / Math.max(cleanA.length, cleanB.length));
    } else {
      // Standard mode: prefix matching + common substring
      const prefixLength = this.commonPrefixLength(cleanA, cleanB);
      const minLength = Math.min(cleanA.length, cleanB.length);
      return prefixLength / minLength;
    }
  }

  /**
   * Levenshtein distance
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b[i - 1] === a[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[b.length][a.length];
  }

  /**
   * Common prefix length
   */
  private commonPrefixLength(a: string, b: string): number {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) {
      i++;
    }
    return i;
  }

  /**
   * Extract mentions from text
   */
  private extractMentions(text: string): string[] {
    if (!text) return [];
    const matches = text.match(/@[\w.]+/g);
    return matches ? matches.map(m => m.substring(1)) : [];
  }

  /**
   * Group participants by username
   */
  private groupByUsername(
    participants: ExtendedParticipant[]
  ): Map<string, ExtendedParticipant[]> {
    const groups = new Map<string, ExtendedParticipant[]>();
    
    for (const p of participants) {
      const key = p.username.toLowerCase();
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(p);
    }
    
    return groups;
  }

  /**
   * Build linked accounts lookup map
   */
  private buildLinkedAccountsMap(
    linkedGroups: LinkedAccountGroup[]
  ): Map<string, string> {
    const map = new Map<string, string>();
    
    for (const group of linkedGroups) {
      const primary = group.primary.toLowerCase();
      for (const linked of group.linked) {
        map.set(linked.toLowerCase(), primary);
      }
    }
    
    return map;
  }

  /**
   * Get filter category from filter ID
   */
  private getFilterCategory(filterId: string): FilterCategory | null {
    const parts = filterId.split('.');
    if (parts.length > 0) {
      const category = parts[0] as FilterCategory;
      if (['participation', 'mentions', 'keywords', 'multiComment', 'profile', 'antiBot', 'followVerification'].includes(category)) {
        return category;
      }
    }
    return null;
  }

  /**
   * Merge partial filters with defaults
   */
  private mergeWithDefaults(filters: Partial<AdvancedDrawFilters>): AdvancedDrawFilters {
    return {
      participation: { ...DEFAULT_FILTERS.participation, ...filters.participation },
      mentions: { ...DEFAULT_FILTERS.mentions, ...filters.mentions },
      keywords: { ...DEFAULT_FILTERS.keywords, ...filters.keywords },
      multiComment: { ...DEFAULT_FILTERS.multiComment, ...filters.multiComment },
      profile: { ...DEFAULT_FILTERS.profile, ...filters.profile },
      antiBot: { ...DEFAULT_FILTERS.antiBot, ...filters.antiBot },
      followVerification: { ...DEFAULT_FILTERS.followVerification, ...filters.followVerification },
    };
  }
}

export const advancedFilterService = new AdvancedFilterService();
export default advancedFilterService;
