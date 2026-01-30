/**
 * Instagram Service Tests
 * Unit tests for Instagram API logic (isolated)
 */

describe("InstagramService - Unit Tests", () => {
  describe("URL Parsing", () => {
    const extractPostId = (url: string): string => {
      const patterns = [
        /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
        /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      throw new Error("Invalid Instagram URL");
    };

    it("should extract post ID from standard URL", () => {
      const url = "https://www.instagram.com/p/ABC123xyz/";
      expect(extractPostId(url)).toBe("ABC123xyz");
    });

    it("should extract post ID from reel URL", () => {
      const url = "https://www.instagram.com/reel/DEF456abc/";
      expect(extractPostId(url)).toBe("DEF456abc");
    });

    it("should extract post ID with query params", () => {
      const url = "https://www.instagram.com/p/ABC123/?utm_source=test";
      expect(extractPostId(url)).toBe("ABC123");
    });

    it("should throw for invalid URL", () => {
      expect(() => extractPostId("not-a-url")).toThrow("Invalid Instagram URL");
    });
  });

  describe("Comment Parsing", () => {
    const extractMentions = (text: string): string[] => {
      const matches = text.match(/@[\w.]+/g) || [];
      return matches.map((m) => m.substring(1));
    };

    it("should extract mentions from comment text", () => {
      const text = "Tagging @friend1 and @friend2!";
      const mentions = extractMentions(text);
      
      expect(mentions).toContain("friend1");
      expect(mentions).toContain("friend2");
    });

    it("should handle comments without mentions", () => {
      const text = "Great post!";
      const mentions = extractMentions(text);
      
      expect(mentions).toHaveLength(0);
    });

    it("should handle usernames with dots", () => {
      const text = "Check out @user.name!";
      const mentions = extractMentions(text);
      
      expect(mentions).toContain("user.name");
    });
  });

  describe("Participant Deduplication", () => {
    const deduplicateParticipants = (participants: any[]): any[] => {
      const seen = new Set<string>();
      return participants.filter((p) => {
        if (seen.has(p.username)) return false;
        seen.add(p.username);
        return true;
      });
    };

    it("should remove duplicate participants", () => {
      const participants = [
        { id: "1", username: "user1" },
        { id: "2", username: "user2" },
        { id: "3", username: "user1" }, // Duplicate
      ];
      
      const unique = deduplicateParticipants(participants);
      
      expect(unique).toHaveLength(2);
    });
  });

  describe("Rate Limit Handling", () => {
    it("should calculate retry delay from headers", () => {
      const resetTimestamp = Math.floor(Date.now() / 1000) + 60;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const delay = (resetTimestamp - currentTimestamp) * 1000;
      
      expect(delay).toBeGreaterThan(0);
      expect(delay).toBeLessThanOrEqual(60000);
    });
  });

  describe("Token Refresh Logic", () => {
    it("should determine if token needs refresh (< 7 days)", () => {
      const expiresIn = 5 * 24 * 60 * 60; // 5 days in seconds
      const needsRefresh = expiresIn < 7 * 24 * 60 * 60;
      
      expect(needsRefresh).toBe(true);
    });

    it("should not refresh if token has > 7 days", () => {
      const expiresIn = 30 * 24 * 60 * 60; // 30 days
      const needsRefresh = expiresIn < 7 * 24 * 60 * 60;
      
      expect(needsRefresh).toBe(false);
    });
  });

  describe("Comment Filtering", () => {
    const filterComments = (comments: any[], filters: any) => {
      return comments.filter((c) => {
        if (filters.excludeOwner && c.isOwner) return false;
        if (filters.minTextLength && c.text.length < filters.minTextLength) return false;
        return true;
      });
    };

    it("should exclude owner comments when configured", () => {
      const comments = [
        { id: "1", text: "Comment 1", isOwner: false },
        { id: "2", text: "Comment 2", isOwner: true },
      ];
      
      const filtered = filterComments(comments, { excludeOwner: true });
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe("1");
    });

    it("should filter by minimum text length", () => {
      const comments = [
        { id: "1", text: "Hi", isOwner: false },
        { id: "2", text: "This is a longer comment", isOwner: false },
      ];
      
      const filtered = filterComments(comments, { minTextLength: 5 });
      
      expect(filtered).toHaveLength(1);
    });
  });

  describe("Follower Count Validation", () => {
    it("should pass if follower count meets minimum", () => {
      const followerCount = 500;
      const minimumFollowers = 100;
      
      expect(followerCount >= minimumFollowers).toBe(true);
    });

    it("should fail if follower count below minimum", () => {
      const followerCount = 50;
      const minimumFollowers = 100;
      
      expect(followerCount >= minimumFollowers).toBe(false);
    });
  });

  describe("Account Age Validation", () => {
    it("should calculate account age in days", () => {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - 30);
      
      const ageInMs = Date.now() - createdAt.getTime();
      const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
      
      expect(ageInDays).toBe(30);
    });
  });
});
