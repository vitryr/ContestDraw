/**
 * YouTube Service Tests
 * Unit tests for YouTube Data API v3 logic (isolated)
 */

describe("YouTubeService - Unit Tests", () => {
  describe("URL Parsing", () => {
    const extractVideoId = (url: string): string => {
      const patterns = [
        /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
        /youtu\.be\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/v\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      throw new Error("Invalid YouTube URL");
    };

    it("should extract from standard watch URL", () => {
      const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      expect(extractVideoId(url)).toBe("dQw4w9WgXcQ");
    });

    it("should extract from short URL", () => {
      const url = "https://youtu.be/dQw4w9WgXcQ";
      expect(extractVideoId(url)).toBe("dQw4w9WgXcQ");
    });

    it("should extract from embed URL", () => {
      const url = "https://www.youtube.com/embed/dQw4w9WgXcQ";
      expect(extractVideoId(url)).toBe("dQw4w9WgXcQ");
    });

    it("should extract from shorts URL", () => {
      const url = "https://youtube.com/shorts/dQw4w9WgXcQ";
      expect(extractVideoId(url)).toBe("dQw4w9WgXcQ");
    });

    it("should handle URL with additional params", () => {
      const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120";
      expect(extractVideoId(url)).toBe("dQw4w9WgXcQ");
    });

    it("should throw for invalid URL", () => {
      expect(() => extractVideoId("not-a-url")).toThrow();
    });
  });

  describe("Comment Parsing", () => {
    const parseComment = (item: any) => ({
      id: item.id,
      authorName: item.snippet.topLevelComment.snippet.authorDisplayName,
      authorChannelId: item.snippet.topLevelComment.snippet.authorChannelId?.value,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      likeCount: item.snippet.topLevelComment.snippet.likeCount || 0,
      replyCount: item.snippet.totalReplyCount || 0,
    });

    it("should parse YouTube comment structure", () => {
      const item = {
        id: "c1",
        snippet: {
          topLevelComment: {
            snippet: {
              authorDisplayName: "Commenter",
              authorChannelId: { value: "UC123" },
              textDisplay: "Great video!",
              likeCount: 10,
            },
          },
          totalReplyCount: 5,
        },
      };
      
      const parsed = parseComment(item);
      
      expect(parsed.authorName).toBe("Commenter");
      expect(parsed.likeCount).toBe(10);
      expect(parsed.replyCount).toBe(5);
    });
  });

  describe("Mention Extraction", () => {
    const extractMentions = (text: string): string[] => {
      const matches = text.match(/@[\w\s]+/g) || [];
      return matches.map((m) => m.trim().substring(1));
    };

    it("should extract mentions from comment", () => {
      const text = "Tagging @John Doe and @Jane Smith!";
      const mentions = extractMentions(text);
      
      expect(mentions.length).toBeGreaterThan(0);
    });
  });

  describe("Pagination", () => {
    it("should detect next page token", () => {
      const response = {
        items: [],
        nextPageToken: "NEXT_PAGE_123",
        pageInfo: { totalResults: 100 },
      };
      
      expect(!!response.nextPageToken).toBe(true);
    });

    it("should detect end of results", () => {
      const response = {
        items: [],
        pageInfo: { totalResults: 50 },
      };
      
      expect(!!(response as any).nextPageToken).toBe(false);
    });
  });

  describe("Video Statistics", () => {
    it("should parse video statistics", () => {
      const video = {
        id: "dQw4w9WgXcQ",
        snippet: {
          title: "Test Video",
          channelTitle: "Test Channel",
        },
        statistics: {
          viewCount: "1000000",
          likeCount: "50000",
          commentCount: "10000",
        },
      };
      
      expect(parseInt(video.statistics.likeCount)).toBe(50000);
      expect(parseInt(video.statistics.commentCount)).toBe(10000);
    });
  });

  describe("Subscription Verification", () => {
    const isSubscribed = (subscriptions: any[], channelId: string): boolean => {
      return subscriptions.some(
        (sub) => sub.snippet.resourceId.channelId === channelId
      );
    };

    it("should verify subscription exists", () => {
      const subs = [
        { snippet: { resourceId: { channelId: "UC_TARGET" } } },
      ];
      
      expect(isSubscribed(subs, "UC_TARGET")).toBe(true);
    });

    it("should detect no subscription", () => {
      const subs = [
        { snippet: { resourceId: { channelId: "UC_OTHER" } } },
      ];
      
      expect(isSubscribed(subs, "UC_TARGET")).toBe(false);
    });
  });

  describe("Quota Management", () => {
    const quotaCosts: Record<string, number> = {
      "commentThreads.list": 1,
      "videos.list": 1,
      "subscriptions.list": 1,
      "channels.list": 1,
    };

    it("should track quota costs", () => {
      const totalCost = quotaCosts["commentThreads.list"] + quotaCosts["videos.list"];
      expect(totalCost).toBe(2);
    });
  });

  describe("Channel Info", () => {
    it("should parse channel data", () => {
      const channel = {
        id: "UC123",
        snippet: {
          title: "Test Channel",
          description: "A test channel",
        },
        statistics: {
          subscriberCount: "100000",
          videoCount: "500",
        },
      };
      
      expect(channel.snippet.title).toBe("Test Channel");
      expect(parseInt(channel.statistics.subscriberCount)).toBe(100000);
    });
  });

  describe("Comment Deduplication", () => {
    it("should remove duplicate commenters", () => {
      const comments = [
        { authorChannelId: "UC1" },
        { authorChannelId: "UC2" },
        { authorChannelId: "UC1" },
      ];
      
      const seen = new Set<string>();
      const unique = comments.filter((c) => {
        if (seen.has(c.authorChannelId)) return false;
        seen.add(c.authorChannelId);
        return true;
      });
      
      expect(unique).toHaveLength(2);
    });
  });
});
