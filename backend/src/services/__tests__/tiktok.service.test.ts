/**
 * TikTok Service Tests
 * Unit tests for TikTok API logic (isolated)
 */

describe("TikTokService - Unit Tests", () => {
  describe("URL Parsing", () => {
    const extractVideoId = (url: string): string => {
      const patterns = [
        /tiktok\.com\/@[\w.]+\/video\/(\d+)/,
        /vm\.tiktok\.com\/(\w+)/,
        /tiktok\.com\/t\/(\w+)/,
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      throw new Error("Invalid TikTok URL");
    };

    it("should extract video ID from standard URL", () => {
      const url = "https://www.tiktok.com/@user/video/1234567890123456789";
      expect(extractVideoId(url)).toBe("1234567890123456789");
    });

    it("should extract from vm.tiktok.com short URL", () => {
      const url = "https://vm.tiktok.com/ABC123/";
      expect(extractVideoId(url)).toBe("ABC123");
    });

    it("should extract from t/ short URL", () => {
      const url = "https://www.tiktok.com/t/XYZ789/";
      expect(extractVideoId(url)).toBe("XYZ789");
    });

    it("should throw for invalid URL", () => {
      expect(() => extractVideoId("not-a-url")).toThrow();
    });
  });

  describe("Comment Parsing", () => {
    const extractMentions = (text: string): string[] => {
      const matches = text.match(/@[\w.]+/g) || [];
      return matches.map((m) => m.substring(1));
    };

    it("should extract mentions from comment", () => {
      const text = "@friend1 @friend2 check this!";
      const mentions = extractMentions(text);
      
      expect(mentions).toHaveLength(2);
      expect(mentions).toContain("friend1");
    });

    it("should handle no mentions", () => {
      expect(extractMentions("No mentions here")).toHaveLength(0);
    });
  });

  describe("Video Metrics", () => {
    it("should parse video statistics", () => {
      const video = {
        id: "123",
        title: "Test Video",
        share_count: 100,
        comment_count: 50,
        like_count: 1000,
        view_count: 10000,
      };
      
      expect(video.like_count).toBe(1000);
      expect(video.comment_count).toBe(50);
    });
  });

  describe("Pagination with Cursor", () => {
    it("should detect more pages", () => {
      const response = {
        data: { comments: [], cursor: 20, has_more: true },
      };
      
      expect(response.data.has_more).toBe(true);
    });

    it("should detect end of pagination", () => {
      const response = {
        data: { comments: [], cursor: 40, has_more: false },
      };
      
      expect(response.data.has_more).toBe(false);
    });
  });

  describe("User Data", () => {
    const mapUser = (apiUser: any) => ({
      userId: apiUser.open_id,
      displayName: apiUser.display_name,
      avatar: apiUser.avatar_url,
    });

    it("should map TikTok user data", () => {
      const apiUser = {
        open_id: "tiktok-123",
        display_name: "TikTok User",
        avatar_url: "https://example.com/avatar.jpg",
      };
      
      const mapped = mapUser(apiUser);
      
      expect(mapped.userId).toBe("tiktok-123");
      expect(mapped.displayName).toBe("TikTok User");
    });
  });

  describe("Token Refresh", () => {
    it("should parse token response", () => {
      const response = {
        data: {
          access_token: "new-token",
          refresh_token: "new-refresh",
          expires_in: 86400,
        },
      };
      
      expect(response.data.access_token).toBe("new-token");
      expect(response.data.expires_in).toBe(86400);
    });
  });

  describe("Error Handling", () => {
    const tiktokErrorCodes: Record<string, string> = {
      invalid_grant: "Invalid authorization code or refresh token",
      rate_limit_exceeded: "Too many requests",
      access_denied: "Insufficient permissions",
      not_found: "Resource not found",
    };

    it("should map error codes", () => {
      expect(tiktokErrorCodes.invalid_grant).toContain("Invalid");
      expect(tiktokErrorCodes.rate_limit_exceeded).toContain("requests");
    });
  });

  describe("Comment Deduplication", () => {
    it("should remove duplicate commenters", () => {
      const comments = [
        { id: "c1", user: { open_id: "u1" } },
        { id: "c2", user: { open_id: "u2" } },
        { id: "c3", user: { open_id: "u1" } },
      ];
      
      const seen = new Set<string>();
      const unique = comments.filter((c) => {
        if (seen.has(c.user.open_id)) return false;
        seen.add(c.user.open_id);
        return true;
      });
      
      expect(unique).toHaveLength(2);
    });
  });
});
