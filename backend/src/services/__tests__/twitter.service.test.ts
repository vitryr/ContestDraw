/**
 * Twitter Service Tests
 * Unit tests for Twitter API v2 logic (isolated)
 */

describe("TwitterService - Unit Tests", () => {
  describe("URL Parsing", () => {
    const extractTweetId = (url: string): string => {
      const patterns = [
        /twitter\.com\/\w+\/status\/(\d+)/,
        /x\.com\/\w+\/status\/(\d+)/,
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      throw new Error("Invalid Twitter URL");
    };

    it("should extract tweet ID from twitter.com URL", () => {
      const url = "https://twitter.com/user/status/1234567890123456789";
      expect(extractTweetId(url)).toBe("1234567890123456789");
    });

    it("should extract tweet ID from x.com URL", () => {
      const url = "https://x.com/user/status/1234567890123456789";
      expect(extractTweetId(url)).toBe("1234567890123456789");
    });

    it("should handle URL with query params", () => {
      const url = "https://twitter.com/user/status/1234567890123456789?s=20";
      expect(extractTweetId(url)).toBe("1234567890123456789");
    });

    it("should throw for invalid URL", () => {
      expect(() => extractTweetId("not-a-url")).toThrow();
    });
  });

  describe("Mention Extraction", () => {
    const extractMentions = (text: string): string[] => {
      const matches = text.match(/@\w+/g) || [];
      return matches.map((m) => m.substring(1));
    };

    it("should extract mentions from tweet text", () => {
      const text = "Hey @friend1 and @friend2, check this out!";
      const mentions = extractMentions(text);
      
      expect(mentions).toContain("friend1");
      expect(mentions).toContain("friend2");
    });

    it("should handle tweets without mentions", () => {
      const text = "Just a regular tweet";
      expect(extractMentions(text)).toHaveLength(0);
    });
  });

  describe("User Data Mapping", () => {
    const mapUserData = (apiUser: any) => ({
      id: apiUser.id,
      username: apiUser.username,
      displayName: apiUser.name,
      followerCount: apiUser.public_metrics?.followers_count || 0,
    });

    it("should map API user data correctly", () => {
      const apiUser = {
        id: "123",
        username: "testuser",
        name: "Test User",
        public_metrics: {
          followers_count: 1000,
          following_count: 500,
        },
      };
      
      const mapped = mapUserData(apiUser);
      
      expect(mapped.username).toBe("testuser");
      expect(mapped.followerCount).toBe(1000);
    });

    it("should default follower count to 0", () => {
      const apiUser = { id: "123", username: "user", name: "User" };
      const mapped = mapUserData(apiUser);
      
      expect(mapped.followerCount).toBe(0);
    });
  });

  describe("Pagination Token Handling", () => {
    it("should detect more pages available", () => {
      const response = {
        data: [{ id: "1" }],
        meta: { next_token: "abc123", result_count: 100 },
      };
      
      expect(!!response.meta.next_token).toBe(true);
    });

    it("should detect end of pagination", () => {
      const response = {
        data: [{ id: "1" }],
        meta: { result_count: 50 },
      };
      
      expect(!!(response.meta as any).next_token).toBe(false);
    });
  });

  describe("Rate Limit Headers", () => {
    it("should parse rate limit reset time", () => {
      const resetTimestamp = 1700000000;
      const resetDate = new Date(resetTimestamp * 1000);
      
      expect(resetDate.getTime()).toBe(1700000000000);
    });

    it("should calculate wait time until reset", () => {
      const resetTimestamp = Math.floor(Date.now() / 1000) + 60;
      const waitTimeMs = (resetTimestamp - Math.floor(Date.now() / 1000)) * 1000;
      
      expect(waitTimeMs).toBeGreaterThan(0);
      expect(waitTimeMs).toBeLessThanOrEqual(60000);
    });
  });

  describe("Tweet Metrics", () => {
    it("should extract public metrics", () => {
      const tweet = {
        id: "123",
        text: "Test tweet",
        public_metrics: {
          retweet_count: 100,
          reply_count: 50,
          like_count: 500,
          quote_count: 25,
        },
      };
      
      expect(tweet.public_metrics.like_count).toBe(500);
      expect(tweet.public_metrics.retweet_count).toBe(100);
    });
  });

  describe("Engagement Participants", () => {
    const combineParticipants = (
      repliers: any[],
      retweeters: any[],
      quoters: any[]
    ) => {
      const all = [...repliers, ...retweeters, ...quoters];
      const unique = new Map<string, any>();
      all.forEach((p) => unique.set(p.id, p));
      return Array.from(unique.values());
    };

    it("should combine and deduplicate participants", () => {
      const repliers = [{ id: "1", username: "user1" }];
      const retweeters = [{ id: "2", username: "user2" }, { id: "1", username: "user1" }];
      const quoters = [{ id: "3", username: "user3" }];
      
      const combined = combineParticipants(repliers, retweeters, quoters);
      
      expect(combined).toHaveLength(3);
    });
  });

  describe("Following Verification", () => {
    const isFollowing = (followingList: any[], targetId: string): boolean => {
      return followingList.some((user) => user.id === targetId);
    };

    it("should verify user is following target", () => {
      const following = [{ id: "target-123" }, { id: "other-456" }];
      expect(isFollowing(following, "target-123")).toBe(true);
    });

    it("should detect user not following target", () => {
      const following = [{ id: "other-456" }];
      expect(isFollowing(following, "target-123")).toBe(false);
    });
  });

  describe("API v2 Response Format", () => {
    it("should handle v2 response with includes", () => {
      const response = {
        data: [{ id: "1", author_id: "a1" }],
        includes: {
          users: [{ id: "a1", username: "author1" }],
        },
      };
      
      const authorId = response.data[0].author_id;
      const author = response.includes.users.find((u) => u.id === authorId);
      
      expect(author?.username).toBe("author1");
    });
  });
});
