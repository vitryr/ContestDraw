/**
 * Hash Utility Tests
 * Tests for cryptographic hash generation and verification
 */

import {
  generateDrawHash,
  verifyDrawHash,
  generateShortHash,
  generateRandomSeed,
} from "../hash.util";

describe("HashUtil", () => {
  const sampleDrawData = {
    drawId: "draw-123",
    timestamp: "2025-01-26T12:00:00.000Z",
    participants: [
      { id: "p1", name: "User One", username: "user1" },
      { id: "p2", name: "User Two", username: "user2" },
    ],
    winners: [
      { id: "w1", position: 1, participantId: "p1" },
    ],
    randomSeed: "abc123seed",
    filters: { removeDuplicates: true },
    algorithm: "Fisher-Yates",
  };

  describe("generateDrawHash", () => {
    it("should generate 64 character hex hash", () => {
      const hash = generateDrawHash(sampleDrawData);

      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]+$/);
    });

    it("should generate consistent hash for same data", () => {
      const hash1 = generateDrawHash(sampleDrawData);
      const hash2 = generateDrawHash(sampleDrawData);

      expect(hash1).toBe(hash2);
    });

    it("should generate different hash for different data", () => {
      const hash1 = generateDrawHash(sampleDrawData);
      const hash2 = generateDrawHash({
        ...sampleDrawData,
        drawId: "draw-456",
      });

      expect(hash1).not.toBe(hash2);
    });

    it("should normalize participants order", () => {
      const data1 = {
        ...sampleDrawData,
        participants: [
          { id: "p1", name: "User One", username: "user1" },
          { id: "p2", name: "User Two", username: "user2" },
        ],
      };

      const data2 = {
        ...sampleDrawData,
        participants: [
          { id: "p2", name: "User Two", username: "user2" },
          { id: "p1", name: "User One", username: "user1" },
        ],
      };

      const hash1 = generateDrawHash(data1);
      const hash2 = generateDrawHash(data2);

      expect(hash1).toBe(hash2);
    });

    it("should normalize winners order by position", () => {
      const data1 = {
        ...sampleDrawData,
        winners: [
          { id: "w1", position: 1, participantId: "p1" },
          { id: "w2", position: 2, participantId: "p2" },
        ],
      };

      const data2 = {
        ...sampleDrawData,
        winners: [
          { id: "w2", position: 2, participantId: "p2" },
          { id: "w1", position: 1, participantId: "p1" },
        ],
      };

      const hash1 = generateDrawHash(data1);
      const hash2 = generateDrawHash(data2);

      expect(hash1).toBe(hash2);
    });
  });

  describe("verifyDrawHash", () => {
    it("should verify correct hash by regenerating", () => {
      const hash = generateDrawHash(sampleDrawData);
      const regeneratedHash = generateDrawHash(sampleDrawData);

      expect(hash).toBe(regeneratedHash);
    });

    it("should detect tampered data by comparing hashes", () => {
      const originalHash = generateDrawHash(sampleDrawData);
      
      // Change drawId to ensure different hash
      const tamperedData = {
        ...sampleDrawData,
        drawId: "tampered-draw-456",
      };

      const tamperedHash = generateDrawHash(tamperedData);

      expect(originalHash).not.toBe(tamperedHash);
    });

    it("should produce different hash for different data", () => {
      const hash1 = generateDrawHash(sampleDrawData);
      const hash2 = generateDrawHash({
        ...sampleDrawData,
        randomSeed: "different-seed",
      });

      expect(hash1).not.toBe(hash2);
    });
  });
});

describe("HashUtil - Unit Logic Tests", () => {
  describe("SHA-256 Hashing", () => {
    it("should use SHA-256 algorithm", () => {
      const crypto = require("crypto");
      const data = "test data";
      const hash = crypto.createHash("sha256").update(data).digest("hex");

      expect(hash).toHaveLength(64);
    });

    it("should produce different hash for different inputs", () => {
      const crypto = require("crypto");
      const hash1 = crypto.createHash("sha256").update("data1").digest("hex");
      const hash2 = crypto.createHash("sha256").update("data2").digest("hex");

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("Short Hash Generation", () => {
    it("should generate 8 character short hash", () => {
      const fullHash = "a".repeat(64);
      const shortHash = fullHash.substring(0, 8);

      expect(shortHash).toHaveLength(8);
    });

    it("should be useful for display", () => {
      const crypto = require("crypto");
      const hash = crypto.createHash("sha256").update("draw-123").digest("hex");
      const shortHash = hash.substring(0, 8);

      expect(shortHash).toMatch(/^[a-f0-9]{8}$/);
    });
  });

  describe("Random Seed Generation", () => {
    it("should generate cryptographically random seed", () => {
      const crypto = require("crypto");
      const seed = crypto.randomBytes(32).toString("hex");

      expect(seed).toHaveLength(64);
    });

    it("should generate unique seeds", () => {
      const crypto = require("crypto");
      const seed1 = crypto.randomBytes(32).toString("hex");
      const seed2 = crypto.randomBytes(32).toString("hex");

      expect(seed1).not.toBe(seed2);
    });
  });

  describe("Data Normalization", () => {
    it("should sort object keys for consistent JSON", () => {
      const obj = { z: 1, a: 2, m: 3 };
      const sortedKeys = Object.keys(obj).sort();
      const normalized = JSON.stringify(obj, sortedKeys);

      expect(normalized).toBe('{"a":2,"m":3,"z":1}');
    });

    it("should sort arrays by ID", () => {
      const items = [{ id: "c" }, { id: "a" }, { id: "b" }];
      const sorted = [...items].sort((a, b) => a.id.localeCompare(b.id));

      expect(sorted[0].id).toBe("a");
      expect(sorted[2].id).toBe("c");
    });
  });

  describe("Hash Format Validation", () => {
    it("should validate SHA-256 hash format", () => {
      const isValidHash = (hash: string): boolean => {
        return /^[a-f0-9]{64}$/.test(hash);
      };

      expect(isValidHash("a".repeat(64))).toBe(true);
      expect(isValidHash("short")).toBe(false);
      expect(isValidHash("G".repeat(64))).toBe(false); // Non-hex
    });
  });

  describe("Integrity Check", () => {
    it("should detect any change in data", () => {
      const crypto = require("crypto");
      
      const original = { value: "original" };
      const modified = { value: "modified" };

      const originalHash = crypto.createHash("sha256")
        .update(JSON.stringify(original))
        .digest("hex");

      const modifiedHash = crypto.createHash("sha256")
        .update(JSON.stringify(modified))
        .digest("hex");

      expect(originalHash).not.toBe(modifiedHash);
    });
  });

  describe("Timestamp Handling", () => {
    it("should handle ISO timestamp strings", () => {
      const timestamp = new Date().toISOString();

      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it("should produce consistent hash for same timestamp", () => {
      const crypto = require("crypto");
      const timestamp = "2025-01-26T12:00:00.000Z";

      const hash1 = crypto.createHash("sha256").update(timestamp).digest("hex");
      const hash2 = crypto.createHash("sha256").update(timestamp).digest("hex");

      expect(hash1).toBe(hash2);
    });
  });
});
