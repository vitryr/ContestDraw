/**
 * Sharing Service Integration Tests
 */

import {
  generateShortCode,
  createShareableLink,
  resolveShortCode,
  generateSocialShareUrls,
  generateEmbedCode,
  generateQRCode,
  cleanupExpiredCodes,
} from "../sharing.service";

describe("SharingService Integration", () => {
  describe("generateShortCode", () => {
    it("should generate 8-char code from draw ID", () => {
      const code = generateShortCode("draw-123");
      expect(code).toHaveLength(8);
    });

    it("should be deterministic", () => {
      const code1 = generateShortCode("draw-abc");
      const code2 = generateShortCode("draw-abc");
      expect(code1).toBe(code2);
    });

    it("should produce different codes for different IDs", () => {
      const code1 = generateShortCode("draw-123");
      const code2 = generateShortCode("draw-456");
      expect(code1).not.toBe(code2);
    });
  });

  describe("createShareableLink", () => {
    it("should create link with all properties", async () => {
      const link = await createShareableLink("draw-test", "https://test.com");

      expect(link).toHaveProperty("shortCode");
      expect(link).toHaveProperty("fullUrl");
      expect(link).toHaveProperty("qrCodeUrl");
      expect(link).toHaveProperty("drawId");
    });

    it("should include short code in URL", async () => {
      const link = await createShareableLink("draw-test", "https://test.com");
      expect(link.fullUrl).toContain(link.shortCode);
    });

    it("should set expiration when days provided", async () => {
      const link = await createShareableLink("draw-test", "https://test.com", 7);
      expect(link.expiresAt).toBeDefined();
    });
  });

  describe("resolveShortCode", () => {
    it("should resolve created short code", async () => {
      const link = await createShareableLink("draw-resolve-test", "https://test.com");
      const drawId = await resolveShortCode(link.shortCode);
      expect(drawId).toBe("draw-resolve-test");
    });

    it("should return null for unknown code", async () => {
      const drawId = await resolveShortCode("unknown1");
      expect(drawId).toBeNull();
    });
  });

  describe("generateSocialShareUrls", () => {
    it("should generate social share URLs", () => {
      const urls = generateSocialShareUrls("draw-123", "My Giveaway", "https://test.com");

      expect(urls).toHaveProperty("twitter");
      expect(urls).toHaveProperty("facebook");
      expect(urls).toHaveProperty("linkedin");
      expect(urls).toHaveProperty("whatsapp");
      expect(urls).toHaveProperty("telegram");
      expect(urls.twitter).toContain("twitter.com");
    });
  });

  describe("generateQRCode", () => {
    it("should generate QR code SVG", () => {
      const qr = generateQRCode("https://test.com/verify/abc");

      expect(qr).toContain("svg");
      expect(qr).toContain("QR");
    });
  });

  describe("cleanupExpiredCodes", () => {
    it("should not throw when cleaning up", () => {
      expect(() => cleanupExpiredCodes()).not.toThrow();
    });
  });

  describe("generateEmbedCode", () => {
    it("should generate iframe embed code", () => {
      const config = {
        drawId: "draw-123",
        width: 600,
        height: 400,
        theme: "dark" as const,
        showParticipants: true,
      };

      const embed = generateEmbedCode(config, "https://test.com");

      expect(embed).toContain("iframe");
      expect(embed).toContain("draw-123");
      expect(embed).toContain("600");
      expect(embed).toContain("400");
    });
  });
});
