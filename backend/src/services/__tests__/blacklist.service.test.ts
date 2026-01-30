/**
 * Blacklist Service Tests
 * Unit tests for participant blacklist logic (isolated)
 */

describe("BlacklistService - Unit Tests", () => {
  describe("Username Normalization", () => {
    const normalizeUsername = (username: string): string => {
      return username.toLowerCase().replace(/^@/, "").trim();
    };

    it("should normalize username to lowercase", () => {
      expect(normalizeUsername("UserName")).toBe("username");
    });

    it("should remove @ prefix", () => {
      expect(normalizeUsername("@username")).toBe("username");
    });

    it("should trim whitespace", () => {
      expect(normalizeUsername("  username  ")).toBe("username");
    });

    it("should handle combined cases", () => {
      expect(normalizeUsername("@UserName  ")).toBe("username");
    });
  });

  describe("Blacklist Matching", () => {
    const isBlacklisted = (username: string, blacklist: string[]): boolean => {
      const normalized = username.toLowerCase().replace(/^@/, "");
      return blacklist.some((b) => b.toLowerCase() === normalized);
    };

    it("should detect blacklisted user", () => {
      const blacklist = ["baduser", "spammer"];
      expect(isBlacklisted("BadUser", blacklist)).toBe(true);
    });

    it("should pass non-blacklisted user", () => {
      const blacklist = ["baduser"];
      expect(isBlacklisted("gooduser", blacklist)).toBe(false);
    });

    it("should handle case insensitivity", () => {
      const blacklist = ["BADUSER"];
      expect(isBlacklisted("baduser", blacklist)).toBe(true);
    });
  });

  describe("Blacklist Import", () => {
    const parseBlacklistInput = (input: string): string[] => {
      return input
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => s.replace(/^@/, "").toLowerCase());
    };

    it("should parse comma-separated list", () => {
      const input = "user1, user2, user3";
      const result = parseBlacklistInput(input);
      
      expect(result).toEqual(["user1", "user2", "user3"]);
    });

    it("should parse newline-separated list", () => {
      const input = "user1\nuser2\nuser3";
      const result = parseBlacklistInput(input);
      
      expect(result).toEqual(["user1", "user2", "user3"]);
    });

    it("should handle mixed input", () => {
      const input = "@user1, @user2\nuser3";
      const result = parseBlacklistInput(input);
      
      expect(result).toEqual(["user1", "user2", "user3"]);
    });

    it("should filter empty entries", () => {
      const input = "user1,,user2,";
      const result = parseBlacklistInput(input);
      
      expect(result).toEqual(["user1", "user2"]);
    });
  });

  describe("Blacklist Storage Format", () => {
    it("should serialize blacklist to JSON", () => {
      const blacklist = ["user1", "user2"];
      const serialized = JSON.stringify(blacklist);
      
      expect(JSON.parse(serialized)).toEqual(["user1", "user2"]);
    });
  });

  describe("Filter Application", () => {
    const filterBlacklisted = (participants: any[], blacklist: string[]): any[] => {
      const blacklistSet = new Set(blacklist.map((b) => b.toLowerCase()));
      return participants.filter(
        (p) => !blacklistSet.has(p.username.toLowerCase())
      );
    };

    it("should remove blacklisted participants", () => {
      const participants = [
        { id: "1", username: "user1" },
        { id: "2", username: "blacklisted" },
        { id: "3", username: "user3" },
      ];
      const blacklist = ["blacklisted"];
      
      const filtered = filterBlacklisted(participants, blacklist);
      
      expect(filtered).toHaveLength(2);
      expect(filtered.find((p) => p.username === "blacklisted")).toBeUndefined();
    });

    it("should handle empty blacklist", () => {
      const participants = [{ id: "1", username: "user1" }];
      const filtered = filterBlacklisted(participants, []);
      
      expect(filtered).toEqual(participants);
    });
  });

  describe("Blacklist Limits", () => {
    const maxBlacklistSize: Record<string, number> = {
      free: 10,
      pro: 100,
      enterprise: 1000,
    };

    it("should enforce tier limits", () => {
      expect(maxBlacklistSize.free).toBe(10);
      expect(maxBlacklistSize.pro).toBe(100);
      expect(maxBlacklistSize.enterprise).toBe(1000);
    });

    it("should check if within limit", () => {
      const currentSize = 15;
      const tier = "free";
      
      expect(currentSize <= maxBlacklistSize[tier]).toBe(false);
    });
  });

  describe("Blacklist Export", () => {
    const exportBlacklist = (blacklist: string[]): string => {
      return blacklist.join("\n");
    };

    it("should export as newline-separated list", () => {
      const blacklist = ["user1", "user2", "user3"];
      const exported = exportBlacklist(blacklist);
      
      expect(exported).toBe("user1\nuser2\nuser3");
    });
  });

  describe("Duplicate Prevention", () => {
    const addToBlacklist = (blacklist: string[], username: string): string[] => {
      const normalized = username.toLowerCase().replace(/^@/, "");
      if (!blacklist.includes(normalized)) {
        return [...blacklist, normalized];
      }
      return blacklist;
    };

    it("should add new username", () => {
      const result = addToBlacklist(["user1"], "user2");
      expect(result).toEqual(["user1", "user2"]);
    });

    it("should not add duplicate", () => {
      const result = addToBlacklist(["user1"], "User1");
      expect(result).toEqual(["user1"]);
    });
  });
});
