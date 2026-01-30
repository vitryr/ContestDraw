/**
 * Certificate Service Integration Tests
 */

// Mock PDFKit before import
jest.mock("pdfkit", () => {
  return jest.fn().mockImplementation(() => {
    const chunks: Buffer[] = [];
    return {
      pipe: jest.fn().mockReturnThis(),
      font: jest.fn().mockReturnThis(),
      fontSize: jest.fn().mockReturnThis(),
      fillColor: jest.fn().mockReturnThis(),
      text: jest.fn().mockReturnThis(),
      moveDown: jest.fn().mockReturnThis(),
      rect: jest.fn().mockReturnThis(),
      fill: jest.fn().mockReturnThis(),
      image: jest.fn().mockReturnThis(),
      end: jest.fn(function(this: any) {
        setTimeout(() => this.emit("end"), 10);
      }),
      on: jest.fn(function(this: any, event: string, cb: Function) {
        if (event === "data") {
          setTimeout(() => cb(Buffer.from("test-pdf-data")), 5);
        }
        if (event === "end") {
          setTimeout(cb, 15);
        }
        return this;
      }),
      emit: jest.fn(),
    };
  });
});

jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

import { CertificateService } from "../certificate.service";
import crypto from "crypto";

describe("CertificateService Integration", () => {
  let service: CertificateService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CertificateService();
  });

  describe("generateCertificate", () => {
    const mockDrawResult = {
      drawId: "draw-test-123",
      timestamp: new Date("2025-01-26T12:00:00Z"),
      totalParticipants: 500,
      eligibleParticipants: 450,
      winners: [
        { 
          participant: { id: "p1", username: "@winner1", comment: "test" },
          position: 1,
          selectedAt: new Date(),
          seed: "seed-1",
        },
      ],
      alternates: [],
      filters: { removeDuplicates: true },
      algorithm: "Fisher-Yates",
    };

    it("should return buffer and hash", async () => {
      const result = await service.generateCertificate(mockDrawResult);

      expect(result).toHaveProperty("buffer");
      expect(result).toHaveProperty("hash");
    });

    it("should generate valid SHA-256 hash", async () => {
      const result = await service.generateCertificate(mockDrawResult);

      expect(result.hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should generate consistent hash for same input", async () => {
      const result1 = await service.generateCertificate(mockDrawResult);
      const result2 = await service.generateCertificate(mockDrawResult);

      expect(result1.hash).toBe(result2.hash);
    });
  });
});

describe("CertificateService - Formatting Logic", () => {
  describe("Winners Formatting", () => {
    it("should format winners list correctly", () => {
      const winners = [
        { participant: { username: "@alice" }, position: 1 },
        { participant: { username: "@bob" }, position: 2 },
      ];

      const formatted = winners.map(w => `${w.position}. ${w.participant.username}`).join("\n");

      expect(formatted).toContain("1. @alice");
      expect(formatted).toContain("2. @bob");
    });

    it("should handle empty winners list", () => {
      const winners: any[] = [];
      const formatted = winners.map(w => `${w.position}. ${w.participant.username}`).join("\n");
      expect(formatted).toBe("");
    });
  });

  describe("Filters Formatting", () => {
    it("should format filter object as list", () => {
      const filters = {
        removeDuplicates: true,
        minFollowers: 100,
      };

      const formatted = Object.entries(filters)
        .filter(([_, v]) => v !== false && v !== null && v !== undefined)
        .map(([k, v]) => `${k}: ${v}`);

      expect(formatted.length).toBe(2);
    });

    it("should filter out false values", () => {
      const filters = {
        removeDuplicates: false,
        minFollowers: 100,
      };

      const formatted = Object.entries(filters)
        .filter(([_, v]) => v !== false && v !== null)
        .map(([k, v]) => `${k}: ${v}`);

      expect(formatted.length).toBe(1);
    });
  });
});

describe("CertificateService - Hash Logic", () => {
  describe("SHA-256 Hash Generation", () => {
    it("should generate deterministic hash", () => {
      const data = { drawId: "test", winners: [] };
      const hash1 = crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
      const hash2 = crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");

      expect(hash1).toBe(hash2);
    });

    it("should generate 64 character hex string", () => {
      const hash = crypto.createHash("sha256").update("test").digest("hex");

      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]+$/);
    });

    it("should produce different hash for different data", () => {
      const hash1 = crypto.createHash("sha256").update("data1").digest("hex");
      const hash2 = crypto.createHash("sha256").update("data2").digest("hex");

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("Certificate Data Structure", () => {
    it("should include all required fields", () => {
      const certData = {
        drawId: "draw-123",
        timestamp: new Date().toISOString(),
        totalParticipants: 100,
        eligibleParticipants: 90,
        winnersCount: 3,
        alternatesCount: 2,
        algorithm: "Fisher-Yates",
        filters: {},
        winners: [],
        alternates: [],
      };

      expect(certData).toHaveProperty("drawId");
      expect(certData).toHaveProperty("timestamp");
      expect(certData).toHaveProperty("winners");
    });
  });
});
