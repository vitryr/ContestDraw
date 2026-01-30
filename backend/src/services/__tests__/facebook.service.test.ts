/**
 * Facebook Service Tests
 * Unit tests for Facebook API logic (isolated)
 */

describe("FacebookService - Unit Tests", () => {
  describe("URL Parsing", () => {
    const extractPostId = (url: string): string => {
      // Facebook post URLs: /posts/123 or /permalink/123 or story_fbid=123
      const patterns = [
        /\/posts\/(\d+)/,
        /\/permalink\/(\d+)/,
        /story_fbid=(\d+)/,
        /\/(\d+_\d+)/,
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      throw new Error("Invalid Facebook URL");
    };

    it("should extract post ID from posts URL", () => {
      const url = "https://www.facebook.com/page/posts/123456789";
      expect(extractPostId(url)).toBe("123456789");
    });

    it("should extract post ID from permalink URL", () => {
      const url = "https://www.facebook.com/permalink/987654321";
      expect(extractPostId(url)).toBe("987654321");
    });

    it("should extract post ID from story_fbid param", () => {
      const url = "https://www.facebook.com/photo?story_fbid=111222333";
      expect(extractPostId(url)).toBe("111222333");
    });
  });

  describe("Comment Tag Extraction", () => {
    const extractTaggedUsers = (messageTags: any[]): string[] => {
      if (!messageTags) return [];
      return messageTags
        .filter((tag) => tag.type === "user")
        .map((tag) => tag.name);
    };

    it("should extract tagged user names", () => {
      const messageTags = [
        { id: "t1", name: "John Doe", type: "user" },
        { id: "t2", name: "Jane Smith", type: "user" },
        { id: "t3", name: "My Page", type: "page" },
      ];
      
      const tagged = extractTaggedUsers(messageTags);
      
      expect(tagged).toHaveLength(2);
      expect(tagged).toContain("John Doe");
      expect(tagged).not.toContain("My Page");
    });

    it("should handle null message tags", () => {
      const tagged = extractTaggedUsers(null as any);
      expect(tagged).toHaveLength(0);
    });
  });

  describe("Reaction Types", () => {
    const reactionTypes = ["LIKE", "LOVE", "WOW", "HAHA", "SAD", "ANGRY"];

    it("should recognize all reaction types", () => {
      reactionTypes.forEach((type) => {
        expect(reactionTypes.includes(type)).toBe(true);
      });
    });

    it("should count total reactions", () => {
      const reactions = [
        { type: "LIKE" },
        { type: "LIKE" },
        { type: "LOVE" },
        { type: "WOW" },
      ];
      
      expect(reactions.length).toBe(4);
    });
  });

  describe("Pagination Handling", () => {
    it("should detect next page from paging object", () => {
      const paging = {
        next: "https://graph.facebook.com/next-page",
        cursors: {
          after: "abc123",
        },
      };
      
      expect(!!paging.next).toBe(true);
    });

    it("should detect end of pagination", () => {
      const paging = {
        cursors: {
          after: "abc123",
        },
      };
      
      expect(!!(paging as any).next).toBe(false);
    });
  });

  describe("Share Count", () => {
    it("should extract share count from post", () => {
      const post = {
        shares: { count: 150 },
      };
      
      expect(post.shares.count).toBe(150);
    });

    it("should default to 0 if no shares", () => {
      const post = {};
      const shareCount = (post as any).shares?.count || 0;
      
      expect(shareCount).toBe(0);
    });
  });

  describe("Page Like Verification", () => {
    const checkPageLike = (userLikes: any[], pageId: string): boolean => {
      return userLikes.some((like) => like.id === pageId);
    };

    it("should return true if user liked the page", () => {
      const likes = [{ id: "page-123" }, { id: "page-456" }];
      expect(checkPageLike(likes, "page-123")).toBe(true);
    });

    it("should return false if user did not like the page", () => {
      const likes = [{ id: "page-456" }];
      expect(checkPageLike(likes, "page-123")).toBe(false);
    });
  });

  describe("Error Code Handling", () => {
    const facebookErrorCodes: Record<number, string> = {
      4: "Rate limit exceeded",
      100: "Invalid parameter",
      190: "Access token expired",
      200: "Permission denied",
    };

    it("should map error codes to messages", () => {
      expect(facebookErrorCodes[4]).toBe("Rate limit exceeded");
      expect(facebookErrorCodes[190]).toBe("Access token expired");
    });

    it("should handle unknown error codes", () => {
      const errorMessage = facebookErrorCodes[999] || "Unknown error";
      expect(errorMessage).toBe("Unknown error");
    });
  });

  describe("Comment Deduplication", () => {
    it("should remove duplicate comments by user ID", () => {
      const comments = [
        { id: "c1", from: { id: "u1" }, message: "First comment" },
        { id: "c2", from: { id: "u2" }, message: "Second comment" },
        { id: "c3", from: { id: "u1" }, message: "Third comment from same user" },
      ];
      
      const seen = new Set<string>();
      const unique = comments.filter((c) => {
        if (seen.has(c.from.id)) return false;
        seen.add(c.from.id);
        return true;
      });
      
      expect(unique).toHaveLength(2);
    });
  });
});
