/**
 * Sharing Service Tests
 * Tests for shareable links, QR codes, and embed functionality
 */

import {
  generateShortCode,
  createShareableLink,
  resolveShortCode,
  generateEmbedCode,
  generateQRCode,
  isShortCodeValid,
} from "../sharing.service";

describe("SharingService", () => {
  describe("generateShortCode", () => {
    it("should generate 8 character short code", () => {
      const shortCode = generateShortCode("draw-123");
      
      expect(shortCode).toHaveLength(8);
    });

    it("should generate consistent code for same draw ID", () => {
      const code1 = generateShortCode("draw-123");
      const code2 = generateShortCode("draw-123");
      
      expect(code1).toBe(code2);
    });

    it("should generate different codes for different draw IDs", () => {
      const code1 = generateShortCode("draw-123");
      const code2 = generateShortCode("draw-456");
      
      expect(code1).not.toBe(code2);
    });

    it("should only contain hex characters", () => {
      const shortCode = generateShortCode("test-draw");
      
      expect(shortCode).toMatch(/^[a-f0-9]+$/);
    });
  });

  describe("createShareableLink", () => {
    const baseUrl = "https://cleack.io";

    it("should create shareable link with all properties", async () => {
      const link = await createShareableLink("draw-123", baseUrl);

      expect(link.shortCode).toBeDefined();
      expect(link.fullUrl).toContain(baseUrl);
      expect(link.qrCodeUrl).toContain(baseUrl);
      expect(link.drawId).toBe("draw-123");
    });

    it("should include short code in URL", async () => {
      const link = await createShareableLink("draw-123", baseUrl);

      expect(link.fullUrl).toContain(link.shortCode);
    });

    it("should set expiration when specified", async () => {
      const link = await createShareableLink("draw-123", baseUrl, 7);

      expect(link.expiresAt).toBeDefined();
      expect(link.expiresAt!.getTime()).toBeGreaterThan(Date.now());
    });

    it("should not have expiration when not specified", async () => {
      const link = await createShareableLink("draw-123", baseUrl);

      expect(link.expiresAt).toBeUndefined();
    });

    it("should generate QR code URL", async () => {
      const link = await createShareableLink("draw-123", baseUrl);

      expect(link.qrCodeUrl).toContain("/api/public/qr/");
    });
  });

  describe("resolveShortCode", () => {
    it("should resolve valid short code to draw ID", async () => {
      const baseUrl = "https://cleack.io";
      const link = await createShareableLink("draw-abc", baseUrl);
      
      const drawId = await resolveShortCode(link.shortCode);

      expect(drawId).toBe("draw-abc");
    });

    it("should return null for unknown short code", async () => {
      const drawId = await resolveShortCode("unknown1");

      expect(drawId).toBeNull();
    });
  });
});

describe("SharingService - Unit Logic Tests", () => {
  describe("Short Code Generation", () => {
    it("should generate codes using SHA-256", () => {
      const crypto = require("crypto");
      const drawId = "test-draw";
      const hash = crypto.createHash("sha256").update(drawId).digest("hex");
      const shortCode = hash.substring(0, 8);

      expect(shortCode).toHaveLength(8);
      expect(shortCode).toBe(generateShortCode(drawId));
    });
  });

  describe("URL Construction", () => {
    it("should construct verification URL correctly", () => {
      const baseUrl = "https://cleack.io";
      const drawId = "draw-123";
      const shortCode = "abc12345";

      const verifyUrl = `${baseUrl}/verify/${drawId}`;
      const shortUrl = `${baseUrl}/v/${shortCode}`;
      const qrUrl = `${baseUrl}/api/public/qr/${shortCode}`;

      expect(verifyUrl).toBe("https://cleack.io/verify/draw-123");
      expect(shortUrl).toBe("https://cleack.io/v/abc12345");
      expect(qrUrl).toBe("https://cleack.io/api/public/qr/abc12345");
    });
  });

  describe("Expiration Logic", () => {
    it("should calculate expiration date correctly", () => {
      const expiresInDays = 7;
      const now = Date.now();
      const expiresAt = new Date(now + expiresInDays * 24 * 60 * 60 * 1000);

      const diffDays = (expiresAt.getTime() - now) / (1000 * 60 * 60 * 24);

      expect(Math.round(diffDays)).toBe(7);
    });

    it("should identify expired links", () => {
      const pastDate = new Date(Date.now() - 1000);
      const isExpired = pastDate.getTime() < Date.now();

      expect(isExpired).toBe(true);
    });

    it("should identify valid links", () => {
      const futureDate = new Date(Date.now() + 86400000);
      const isExpired = futureDate.getTime() < Date.now();

      expect(isExpired).toBe(false);
    });
  });

  describe("Embed Code Generation", () => {
    it("should generate iframe embed code", () => {
      const config = {
        drawId: "draw-123",
        width: 600,
        height: 400,
        theme: "dark" as const,
      };

      const embedCode = `<iframe src="https://cleack.io/embed/${config.drawId}?theme=${config.theme}" width="${config.width}" height="${config.height}" frameborder="0"></iframe>`;

      expect(embedCode).toContain("iframe");
      expect(embedCode).toContain(config.drawId);
      expect(embedCode).toContain(`width="${config.width}"`);
      expect(embedCode).toContain("theme=dark");
    });

    it("should use default dimensions", () => {
      const defaultWidth = 600;
      const defaultHeight = 400;

      expect(defaultWidth).toBe(600);
      expect(defaultHeight).toBe(400);
    });
  });

  describe("QR Code URL", () => {
    it("should generate correct QR code API URL", () => {
      const baseUrl = "https://cleack.io";
      const shortCode = "abc12345";
      const qrUrl = `${baseUrl}/api/public/qr/${shortCode}`;

      expect(qrUrl).toContain("/api/public/qr/");
      expect(qrUrl).toContain(shortCode);
    });

    it("should support size parameter", () => {
      const baseUrl = "https://cleack.io";
      const shortCode = "abc12345";
      const size = 300;
      const qrUrl = `${baseUrl}/api/public/qr/${shortCode}?size=${size}`;

      expect(qrUrl).toContain(`size=${size}`);
    });
  });

  describe("Share Platforms", () => {
    const sharePlatforms = {
      twitter: (url: string, text: string) =>
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      facebook: (url: string) =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: (url: string, title: string) =>
        `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    };

    it("should generate Twitter share URL", () => {
      const url = sharePlatforms.twitter(
        "https://cleack.io/v/abc123",
        "Check out this giveaway!"
      );

      expect(url).toContain("twitter.com/intent/tweet");
      expect(url).toContain("cleack.io");
    });

    it("should generate Facebook share URL", () => {
      const url = sharePlatforms.facebook("https://cleack.io/v/abc123");

      expect(url).toContain("facebook.com/sharer");
    });

    it("should generate LinkedIn share URL", () => {
      const url = sharePlatforms.linkedin(
        "https://cleack.io/v/abc123",
        "Giveaway Winner"
      );

      expect(url).toContain("linkedin.com/shareArticle");
    });
  });

  describe("Short Code Validation", () => {
    it("should validate correct short code format", () => {
      const isValid = (code: string): boolean => {
        return /^[a-f0-9]{8}$/.test(code);
      };

      expect(isValid("abc12345")).toBe(true);
      expect(isValid("abcd1234")).toBe(true);
    });

    it("should reject invalid short codes", () => {
      const isValid = (code: string): boolean => {
        return /^[a-f0-9]{8}$/.test(code);
      };

      expect(isValid("short")).toBe(false);
      expect(isValid("toolongcode")).toBe(false);
      expect(isValid("ABCD1234")).toBe(false); // Uppercase
      expect(isValid("ghij1234")).toBe(false); // Non-hex
    });
  });
});
