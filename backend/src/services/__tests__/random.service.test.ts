import {
  selectWinners,
  generateRandomSeed,
  verifyDrawResult,
} from "../random.service";
import { DrawParticipant, SocialPlatform } from "../../types";

describe("RandomService", () => {
  const mockParticipants: DrawParticipant[] = [
    {
      id: "1",
      name: "Alice",
      identifier: "@alice",
      source: SocialPlatform.INSTAGRAM,
    },
    {
      id: "2",
      name: "Bob",
      identifier: "@bob",
      source: SocialPlatform.INSTAGRAM,
    },
    {
      id: "3",
      name: "Charlie",
      identifier: "@charlie",
      source: SocialPlatform.YOUTUBE,
    },
    {
      id: "4",
      name: "Diana",
      identifier: "@diana",
      source: SocialPlatform.TIKTOK,
    },
    {
      id: "5",
      name: "Eve",
      identifier: "@eve",
      source: SocialPlatform.FACEBOOK,
    },
  ];

  describe("selectWinners", () => {
    it("should select the correct number of winners", () => {
      const winners = selectWinners(mockParticipants, 2, false);
      expect(winners).toHaveLength(2);
    });

    it("should select unique winners when duplicates not allowed", () => {
      const winners = selectWinners(mockParticipants, 3, false);
      const ids = winners.map((w) => w.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });

    it("should allow duplicate winners when enabled", () => {
      // Run multiple times to increase chance of duplicates
      let hasDuplicates = false;
      for (let i = 0; i < 100; i++) {
        const winners = selectWinners(mockParticipants, 5, true);
        const ids = winners.map((w) => w.id);
        const uniqueIds = new Set(ids);
        if (uniqueIds.size < ids.length) {
          hasDuplicates = true;
          break;
        }
      }
      // With 5 picks from 5 participants, duplicates are very likely
      expect(hasDuplicates).toBe(true);
    });

    it("should throw error for empty participants", () => {
      expect(() => selectWinners([], 1, false)).toThrow(
        "No participants provided",
      );
    });

    it("should throw error for zero winners", () => {
      expect(() => selectWinners(mockParticipants, 0, false)).toThrow(
        "Number of winners must be at least 1",
      );
    });

    it("should throw error when winners exceed participants (no duplicates)", () => {
      expect(() => selectWinners(mockParticipants, 10, false)).toThrow(
        "Number of winners cannot exceed number of participants when duplicates are not allowed",
      );
    });

    it("should return all participants when winners equals participants (no duplicates)", () => {
      const winners = selectWinners(mockParticipants, 5, false);
      expect(winners).toHaveLength(5);
      const ids = new Set(winners.map((w) => w.id));
      expect(ids.size).toBe(5);
    });

    it("should return valid participants from original list", () => {
      const winners = selectWinners(mockParticipants, 3, false);
      const validIds = new Set(mockParticipants.map((p) => p.id));
      winners.forEach((winner) => {
        expect(validIds.has(winner.id)).toBe(true);
      });
    });
  });

  describe("selectWinners with seed", () => {
    const seed = "test-seed-12345";

    it("should produce deterministic results with same seed", () => {
      const winners1 = selectWinners(mockParticipants, 2, false, seed);
      const winners2 = selectWinners(mockParticipants, 2, false, seed);

      expect(winners1.map((w) => w.id)).toEqual(winners2.map((w) => w.id));
    });

    it("should produce different results with different seeds", () => {
      const winners1 = selectWinners(mockParticipants, 3, false, "seed-a");
      const winners2 = selectWinners(mockParticipants, 3, false, "seed-b");

      // While not guaranteed, different seeds should produce different results
      const ids1 = winners1
        .map((w) => w.id)
        .sort()
        .join(",");
      const ids2 = winners2
        .map((w) => w.id)
        .sort()
        .join(",");
      // At least the order should be different most of the time
      expect(winners1.map((w) => w.id).join(",")).not.toBe(
        winners2.map((w) => w.id).join(","),
      );
    });
  });

  describe("generateRandomSeed", () => {
    it("should generate a 64 character hex string", () => {
      const seed = generateRandomSeed();
      expect(seed).toMatch(/^[0-9a-f]{64}$/);
    });

    it("should generate unique seeds", () => {
      const seeds = new Set<string>();
      for (let i = 0; i < 100; i++) {
        seeds.add(generateRandomSeed());
      }
      expect(seeds.size).toBe(100);
    });
  });

  describe("verifyDrawResult", () => {
    const seed = "verification-seed-xyz";

    it("should verify correct draw results", () => {
      const winners = selectWinners(mockParticipants, 2, false, seed);
      const isValid = verifyDrawResult(
        mockParticipants,
        2,
        false,
        seed,
        winners,
      );
      expect(isValid).toBe(true);
    });

    it("should fail verification for incorrect winners", () => {
      const fakeWinners = [mockParticipants[0], mockParticipants[1]];
      const isValid = verifyDrawResult(
        mockParticipants,
        2,
        false,
        seed,
        fakeWinners,
      );
      // May or may not be valid depending on actual draw result
      const actualWinners = selectWinners(mockParticipants, 2, false, seed);
      const actualIds = actualWinners.map((w) => w.id).join(",");
      const fakeIds = fakeWinners.map((w) => w.id).join(",");
      expect(isValid).toBe(actualIds === fakeIds);
    });

    it("should fail verification for wrong number of winners", () => {
      const winners = selectWinners(mockParticipants, 2, false, seed);
      const isValid = verifyDrawResult(
        mockParticipants,
        3,
        false,
        seed,
        winners,
      );
      expect(isValid).toBe(false);
    });

    it("should fail verification for wrong seed", () => {
      const winners = selectWinners(mockParticipants, 2, false, seed);
      const isValid = verifyDrawResult(
        mockParticipants,
        2,
        false,
        "wrong-seed",
        winners,
      );
      expect(isValid).toBe(false);
    });
  });

  describe("randomness distribution", () => {
    it("should have roughly uniform distribution", () => {
      const counts: Record<string, number> = {};
      mockParticipants.forEach((p) => (counts[p.id] = 0));

      const iterations = 1000;
      for (let i = 0; i < iterations; i++) {
        const [winner] = selectWinners(mockParticipants, 1, false);
        counts[winner.id]++;
      }

      // Each participant should be selected roughly 20% of the time (200 times)
      // Allow for statistical variance (15-25%)
      Object.values(counts).forEach((count) => {
        expect(count).toBeGreaterThan(iterations * 0.12); // > 12%
        expect(count).toBeLessThan(iterations * 0.28); // < 28%
      });
    });
  });
});
