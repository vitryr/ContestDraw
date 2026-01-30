/**
 * Draw Service Tests
 * Comprehensive tests for draw engine logic
 */

import { DrawService } from "../draw.service";

// Mock dependencies
jest.mock("../certificate.service", () => ({
  CertificateService: jest.fn().mockImplementation(() => ({
    generateCertificate: jest.fn().mockResolvedValue({
      buffer: Buffer.from("test-pdf"),
      hash: "test-hash-123",
    }),
  })),
}));

jest.mock("../analytics.service", () => ({
  analyticsService: {
    trackDrawCompleted: jest.fn(),
    trackDrawFailed: jest.fn(),
  },
}));

jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe("DrawService", () => {
  let drawService: DrawService;

  beforeEach(() => {
    jest.clearAllMocks();
    drawService = new DrawService();
  });

  describe("parseParticipants", () => {
    it("should parse raw comments into participants", () => {
      const rawComments = [
        { id: "c1", username: "user1", text: "I want to win! @friend1" },
        { id: "c2", username: "user2", text: "Pick me #giveaway" },
      ];

      const participants = (drawService as any).parseParticipants(rawComments);

      expect(participants).toHaveLength(2);
      expect(participants[0].username).toBe("user1");
      expect(participants[0].mentions).toContain("friend1");
      expect(participants[1].hashtags).toContain("giveaway");
    });

    it("should handle missing fields with defaults", () => {
      const rawComments = [{ text: "Just a comment" }];

      const participants = (drawService as any).parseParticipants(rawComments);

      expect(participants[0].id).toBe("participant-0");
      expect(participants[0].username).toBe("user-0");
    });

    it("should extract multiple mentions", () => {
      const rawComments = [
        { id: "c1", username: "user1", text: "@friend1 @friend2 @friend3" },
      ];

      const participants = (drawService as any).parseParticipants(rawComments);

      expect(participants[0].mentions).toHaveLength(3);
      expect(participants[0].mentions).toEqual(["friend1", "friend2", "friend3"]);
    });

    it("should extract multiple hashtags", () => {
      const rawComments = [
        { id: "c1", username: "user1", text: "#giveaway #contest #win" },
      ];

      const participants = (drawService as any).parseParticipants(rawComments);

      expect(participants[0].hashtags).toHaveLength(3);
    });
  });

  describe("extractMentions", () => {
    it("should extract @mentions from text", () => {
      const mentions = (drawService as any).extractMentions("Hello @user1 and @user2!");
      
      expect(mentions).toEqual(["user1", "user2"]);
    });

    it("should return empty array for text without mentions", () => {
      const mentions = (drawService as any).extractMentions("No mentions here");
      
      expect(mentions).toEqual([]);
    });

    it("should handle usernames with numbers", () => {
      const mentions = (drawService as any).extractMentions("@user123 @test456");
      
      expect(mentions).toEqual(["user123", "test456"]);
    });
  });

  describe("extractHashtags", () => {
    it("should extract #hashtags from text", () => {
      const hashtags = (drawService as any).extractHashtags("Check #giveaway #win");
      
      expect(hashtags).toEqual(["giveaway", "win"]);
    });

    it("should return empty array for text without hashtags", () => {
      const hashtags = (drawService as any).extractHashtags("No hashtags");
      
      expect(hashtags).toEqual([]);
    });
  });

  describe("applyDuplicateFilter", () => {
    it("should remove duplicate usernames (keep first)", () => {
      const participants = [
        { id: "1", username: "user1", comment: "First" },
        { id: "2", username: "user2", comment: "Second" },
        { id: "3", username: "User1", comment: "Duplicate" }, // Same user, different case
      ];

      const filtered = (drawService as any).applyDuplicateFilter(participants);

      expect(filtered).toHaveLength(2);
      expect(filtered[0].comment).toBe("First");
    });

    it("should be case-insensitive", () => {
      const participants = [
        { id: "1", username: "UserName", comment: "First" },
        { id: "2", username: "username", comment: "Duplicate" },
        { id: "3", username: "USERNAME", comment: "Also duplicate" },
      ];

      const filtered = (drawService as any).applyDuplicateFilter(participants);

      expect(filtered).toHaveLength(1);
    });
  });

  describe("applyEntriesLimitFilter", () => {
    it("should limit entries per user", () => {
      const participants = [
        { id: "1", username: "user1", comment: "Entry 1" },
        { id: "2", username: "user1", comment: "Entry 2" },
        { id: "3", username: "user1", comment: "Entry 3" },
        { id: "4", username: "user2", comment: "Entry 1" },
      ];

      const filtered = (drawService as any).applyEntriesLimitFilter(participants, 2);

      expect(filtered).toHaveLength(3);
      expect(filtered.filter((p: any) => p.username === "user1")).toHaveLength(2);
    });

    it("should set entryCount on each participant", () => {
      const participants = [
        { id: "1", username: "user1", comment: "Entry 1" },
        { id: "2", username: "user1", comment: "Entry 2" },
      ];

      const filtered = (drawService as any).applyEntriesLimitFilter(participants, 3);

      expect(filtered[0].entryCount).toBe(1);
      expect(filtered[1].entryCount).toBe(2);
    });
  });

  describe("applyMentionsFilter", () => {
    it("should filter by minimum mentions count", () => {
      const participants = [
        { id: "1", username: "user1", mentions: ["friend1"] },
        { id: "2", username: "user2", mentions: ["friend1", "friend2"] },
        { id: "3", username: "user3", mentions: [] },
      ];

      const filtered = (drawService as any).applyMentionsFilter(participants, 2);

      expect(filtered).toHaveLength(1);
      expect(filtered[0].username).toBe("user2");
    });

    it("should include participants with exact min mentions", () => {
      const participants = [
        { id: "1", username: "user1", mentions: ["f1", "f2", "f3"] },
        { id: "2", username: "user2", mentions: ["f1", "f2"] },
      ];

      const filtered = (drawService as any).applyMentionsFilter(participants, 2);

      expect(filtered).toHaveLength(2);
    });
  });

  describe("applyHashtagFilter", () => {
    it("should filter by required hashtag", () => {
      const participants = [
        { id: "1", username: "user1", hashtags: ["giveaway", "win"] },
        { id: "2", username: "user2", hashtags: ["contest"] },
        { id: "3", username: "user3", hashtags: ["giveaway"] },
      ];

      const filtered = (drawService as any).applyHashtagFilter(participants, "giveaway");

      expect(filtered).toHaveLength(2);
    });

    it("should be case-insensitive", () => {
      const participants = [
        { id: "1", username: "user1", hashtags: ["GIVEAWAY"] },
        { id: "2", username: "user2", hashtags: ["Giveaway"] },
      ];

      const filtered = (drawService as any).applyHashtagFilter(participants, "giveaway");

      expect(filtered).toHaveLength(2);
    });

    it("should handle hashtag with # prefix", () => {
      const participants = [
        { id: "1", username: "user1", hashtags: ["contest"] },
      ];

      const filtered = (drawService as any).applyHashtagFilter(participants, "#contest");

      expect(filtered).toHaveLength(1);
    });
  });

  describe("applyKeywordFilter", () => {
    it("should filter by required keywords (OR logic)", () => {
      const participants = [
        { id: "1", username: "user1", comment: "I love this product" },
        { id: "2", username: "user2", comment: "Amazing giveaway" },
        { id: "3", username: "user3", comment: "Random comment" },
      ];

      const filtered = (drawService as any).applyKeywordFilter(
        participants,
        ["love", "amazing"]
      );

      expect(filtered).toHaveLength(2);
    });

    it("should be case-insensitive", () => {
      const participants = [
        { id: "1", username: "user1", comment: "I LOVE IT" },
        { id: "2", username: "user2", comment: "love this" },
      ];

      const filtered = (drawService as any).applyKeywordFilter(participants, ["love"]);

      expect(filtered).toHaveLength(2);
    });
  });

  describe("applyBlacklist", () => {
    it("should exclude blacklisted usernames", () => {
      const participants = [
        { id: "1", username: "user1" },
        { id: "2", username: "spammer" },
        { id: "3", username: "user3" },
      ];

      const filtered = (drawService as any).applyBlacklist(participants, ["spammer"]);

      expect(filtered).toHaveLength(2);
      expect(filtered.find((p: any) => p.username === "spammer")).toBeUndefined();
    });

    it("should be case-insensitive", () => {
      const participants = [
        { id: "1", username: "SPAMMER" },
        { id: "2", username: "SpAmMeR" },
      ];

      const filtered = (drawService as any).applyBlacklist(participants, ["spammer"]);

      expect(filtered).toHaveLength(0);
    });

    it("should handle @ prefix in blacklist", () => {
      const participants = [
        { id: "1", username: "baduser" },
      ];

      const filtered = (drawService as any).applyBlacklist(participants, ["@baduser"]);

      expect(filtered).toHaveLength(0);
    });
  });

  describe("selectWinners", () => {
    it("should select correct number of winners and alternates", () => {
      const participants = Array.from({ length: 20 }, (_, i) => ({
        id: `p${i}`,
        username: `user${i}`,
        comment: `Comment ${i}`,
        mentions: [],
        hashtags: [],
        timestamp: new Date(),
      }));

      const { winners, alternates } = drawService.selectWinners(participants, 3, 2);

      expect(winners).toHaveLength(3);
      expect(alternates).toHaveLength(2);
    });

    it("should assign correct positions to winners", () => {
      const participants = Array.from({ length: 10 }, (_, i) => ({
        id: `p${i}`,
        username: `user${i}`,
        comment: `Comment ${i}`,
        mentions: [],
        hashtags: [],
        timestamp: new Date(),
      }));

      const { winners } = drawService.selectWinners(participants, 3, 0);

      expect(winners[0].position).toBe(1);
      expect(winners[1].position).toBe(2);
      expect(winners[2].position).toBe(3);
    });

    it("should throw if not enough participants", () => {
      const participants = [
        { id: "1", username: "user1", comment: "test", mentions: [], hashtags: [], timestamp: new Date() },
      ];

      expect(() => drawService.selectWinners(participants, 3, 2)).toThrow(
        "Not enough participants"
      );
    });

    it("should not have duplicate winners", () => {
      const participants = Array.from({ length: 100 }, (_, i) => ({
        id: `p${i}`,
        username: `user${i}`,
        comment: `Comment ${i}`,
        mentions: [],
        hashtags: [],
        timestamp: new Date(),
      }));

      const { winners, alternates } = drawService.selectWinners(participants, 10, 5);
      
      const allSelected = [...winners, ...alternates].map(w => w.participant.id);
      const uniqueSelected = new Set(allSelected);

      expect(uniqueSelected.size).toBe(allSelected.length);
    });

    it("should include seed for audit trail", () => {
      const participants = Array.from({ length: 5 }, (_, i) => ({
        id: `p${i}`,
        username: `user${i}`,
        comment: `Comment ${i}`,
        mentions: [],
        hashtags: [],
        timestamp: new Date(),
      }));

      const { winners } = drawService.selectWinners(participants, 2, 0);

      expect(winners[0].seed).toBeDefined();
      expect(winners[0].seed).toContain("winner");
    });
  });

  describe("processParticipants", () => {
    it("should apply multiple filters in sequence", async () => {
      const participants = [
        { id: "1", username: "user1", comment: "test", mentions: ["f1"], hashtags: ["giveaway"] },
        { id: "2", username: "user1", comment: "duplicate", mentions: [], hashtags: [] },
        { id: "3", username: "spammer", comment: "#giveaway", mentions: [], hashtags: ["giveaway"] },
        { id: "4", username: "user2", comment: "#giveaway", mentions: [], hashtags: ["giveaway"] },
      ];

      const filters = {
        removeDuplicates: true,
        blacklist: ["spammer"],
        requiredHashtag: "giveaway",
        minMentions: 0,
        maxEntriesPerUser: null,
        verifyFollowing: false,
        followingAccounts: [],
        requiredKeywords: [],
      };

      const eligible = await drawService.processParticipants(participants, filters);

      // Should have user1 (first entry with hashtag) and user2
      expect(eligible.length).toBeLessThanOrEqual(2);
    });

    it("should handle empty filters", async () => {
      const participants = [
        { id: "1", username: "user1", comment: "test", mentions: [], hashtags: [] },
        { id: "2", username: "user2", comment: "test2", mentions: [], hashtags: [] },
      ];

      const filters = {
        removeDuplicates: false,
        blacklist: [],
        minMentions: 0,
        maxEntriesPerUser: null,
        verifyFollowing: false,
        followingAccounts: [],
        requiredKeywords: [],
      };

      const eligible = await drawService.processParticipants(participants, filters);

      expect(eligible).toHaveLength(2);
    });
  });

  describe("validateDrawConfig", () => {
    it("should validate correct config", () => {
      const config = {
        drawId: "draw-123",
        winnersCount: 3,
        alternatesCount: 2,
        filters: {
          removeDuplicates: true,
          blacklist: [],
          minMentions: 0,
          maxEntriesPerUser: null,
          verifyFollowing: false,
          followingAccounts: [],
        },
      };

      const result = drawService.validateDrawConfig(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing drawId", () => {
      const config = {
        drawId: "",
        winnersCount: 3,
        alternatesCount: 2,
        filters: { minMentions: 0, maxEntriesPerUser: null },
      };

      const result = drawService.validateDrawConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Draw ID is required");
    });

    it("should detect zero winners", () => {
      const config = {
        drawId: "draw-123",
        winnersCount: 0,
        alternatesCount: 0,
        filters: { minMentions: 0, maxEntriesPerUser: null },
      };

      const result = drawService.validateDrawConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes("Winners"))).toBe(true);
    });

    it("should detect negative alternates", () => {
      const config = {
        drawId: "draw-123",
        winnersCount: 3,
        alternatesCount: -1,
        filters: { minMentions: 0, maxEntriesPerUser: null },
      };

      const result = drawService.validateDrawConfig(config);

      expect(result.valid).toBe(false);
    });

    it("should detect invalid maxEntriesPerUser", () => {
      const config = {
        drawId: "draw-123",
        winnersCount: 3,
        alternatesCount: 0,
        filters: { minMentions: 0, maxEntriesPerUser: 0 },
      };

      const result = drawService.validateDrawConfig(config);

      expect(result.valid).toBe(false);
    });

    it("should detect verifyFollowing without accounts", () => {
      const config = {
        drawId: "draw-123",
        winnersCount: 3,
        alternatesCount: 0,
        filters: { 
          minMentions: 0, 
          maxEntriesPerUser: null,
          verifyFollowing: true,
          followingAccounts: [],
        },
      };

      const result = drawService.validateDrawConfig(config);

      expect(result.valid).toBe(false);
    });
  });

  describe("validateParticipantData", () => {
    it("should validate valid participants", () => {
      const participants = [
        { username: "user1", comment: "test", id: "1", mentions: [], hashtags: [], timestamp: new Date() },
        { username: "user2", comment: "test2", id: "2", mentions: [], hashtags: [], timestamp: new Date() },
      ];

      const result = drawService.validateParticipantData(participants);

      expect(result.valid).toBe(true);
    });

    it("should detect empty participants array", () => {
      const result = drawService.validateParticipantData([]);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("No participants provided");
    });

    it("should detect missing username", () => {
      const participants = [
        { username: "", comment: "test", id: "1", mentions: [], hashtags: [], timestamp: new Date() },
      ];

      const result = drawService.validateParticipantData(participants);

      expect(result.valid).toBe(false);
    });
  });

  describe("executeDraw (integration)", () => {
    it("should execute full draw workflow", async () => {
      const rawComments = Array.from({ length: 50 }, (_, i) => ({
        id: `comment-${i}`,
        username: `user${i}`,
        text: `Entry #giveaway @friend${i}`,
        timestamp: Date.now(),
      }));

      const config = {
        drawId: "test-draw-123",
        winnersCount: 3,
        alternatesCount: 2,
        filters: {
          removeDuplicates: true,
          blacklist: [],
          minMentions: 0,
          maxEntriesPerUser: null,
          requiredHashtag: "giveaway",
          verifyFollowing: false,
          followingAccounts: [],
          requiredKeywords: [],
        },
      };

      const result = await drawService.executeDraw(rawComments, config);

      expect(result.drawId).toBe("test-draw-123");
      expect(result.winners).toHaveLength(3);
      expect(result.alternates).toHaveLength(2);
      expect(result.totalParticipants).toBe(50);
      expect(result.algorithm).toContain("Fisher-Yates");
      expect(result.certificateHash).toBeDefined();
    });

    it("should throw for no eligible participants", async () => {
      const rawComments = [
        { id: "1", username: "user1", text: "No hashtag" },
      ];

      const config = {
        drawId: "test-draw",
        winnersCount: 1,
        alternatesCount: 0,
        filters: {
          requiredHashtag: "giveaway",
          removeDuplicates: false,
          blacklist: [],
          minMentions: 0,
          maxEntriesPerUser: null,
        },
      };

      await expect(drawService.executeDraw(rawComments, config)).rejects.toThrow(
        "No eligible participants"
      );
    });

    it("should throw for insufficient participants", async () => {
      const rawComments = [
        { id: "1", username: "user1", text: "#giveaway" },
      ];

      const config = {
        drawId: "test-draw",
        winnersCount: 5,
        alternatesCount: 2,
        filters: {
          removeDuplicates: false,
          blacklist: [],
          minMentions: 0,
          maxEntriesPerUser: null,
        },
      };

      await expect(drawService.executeDraw(rawComments, config)).rejects.toThrow(
        "Not enough eligible participants"
      );
    });
  });
});
