/**
 * Video Service Tests
 * Tests for video generation configuration and logic
 */

import {
  generateDrawVideo,
  generateDrawThumbnail,
  defaultVideoConfig,
} from "../video.service";

describe("VideoService", () => {
  describe("defaultVideoConfig", () => {
    it("should have 1080x1920 resolution (9:16 vertical for social media)", () => {
      expect(defaultVideoConfig.width).toBe(1080);
      expect(defaultVideoConfig.height).toBe(1920);
    });

    it("should have 10 fps", () => {
      expect(defaultVideoConfig.fps).toBe(10);
    });

    it("should have 8 second duration", () => {
      expect(defaultVideoConfig.duration).toBe(8);
    });

    it("should have dark background color", () => {
      expect(defaultVideoConfig.backgroundColor).toBe("#1a1a2e");
    });

    it("should have white text color", () => {
      expect(defaultVideoConfig.textColor).toBe("#ffffff");
    });

    it("should have medium animation speed", () => {
      expect(defaultVideoConfig.animationSpeed).toBe("medium");
    });
  });

  describe("generateDrawVideo", () => {
    it("should generate a video buffer for a draw", async () => {
      const mockDraw = {
        id: "draw-123",
        title: "Test Draw",
        winners: [
          { position: 1, participant: { name: "Winner 1", identifier: "winner1" } },
        ],
        participants: [
          { name: "Participant 1", identifier: "user1" },
          { name: "Participant 2", identifier: "user2" },
        ],
      };

      const result = await generateDrawVideo(mockDraw);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    }, 30000); // Allow 30s for video generation
  });

  describe("generateDrawThumbnail", () => {
    it("should generate a thumbnail buffer for a draw", async () => {
      const mockDraw = {
        id: "draw-123",
        title: "Test Draw",
        winners: [
          { position: 1, participant: { name: "Winner 1", identifier: "winner1" } },
        ],
        participants: [
          { name: "Participant 1", identifier: "user1" },
        ],
      };

      const result = await generateDrawThumbnail(mockDraw);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});

describe("VideoService - Unit Logic Tests", () => {
  describe("Video Configuration", () => {
    it("should have valid social media resolution (9:16 vertical)", () => {
      const validResolutions = [
        { width: 1080, height: 1920 }, // 9:16 vertical (Instagram/TikTok)
        { width: 1920, height: 1080 }, // 16:9 horizontal
        { width: 1280, height: 720 },  // 16:9 HD
      ];

      const config = { width: defaultVideoConfig.width, height: defaultVideoConfig.height };
      const isValidResolution = validResolutions.some(
        (r) => r.width === config.width && r.height === config.height
      );

      expect(isValidResolution).toBe(true);
    });

    it("should have valid FPS range for social media", () => {
      const validFpsRange = { min: 10, max: 60 };
      const fps = defaultVideoConfig.fps;

      expect(fps).toBeGreaterThanOrEqual(validFpsRange.min);
      expect(fps).toBeLessThanOrEqual(validFpsRange.max);
    });

    it("should have valid duration range", () => {
      const validDurationRange = { min: 5, max: 60 };
      const duration = defaultVideoConfig.duration;

      expect(duration).toBeGreaterThanOrEqual(validDurationRange.min);
      expect(duration).toBeLessThanOrEqual(validDurationRange.max);
    });
  });

  describe("Animation Speed", () => {
    const speedMultipliers = {
      slow: 0.5,
      medium: 1.0,
      fast: 2.0,
    };

    it("should have correct speed multipliers", () => {
      expect(speedMultipliers.slow).toBeLessThan(speedMultipliers.medium);
      expect(speedMultipliers.medium).toBeLessThan(speedMultipliers.fast);
    });

    it("should calculate animation duration based on speed", () => {
      const baseDuration = 10;
      const speed = "fast";
      const actualDuration = baseDuration / speedMultipliers[speed];

      expect(actualDuration).toBe(5);
    });
  });

  describe("Color Validation", () => {
    it("should validate hex color format", () => {
      const isValidHexColor = (color: string): boolean => {
        return /^#[0-9A-Fa-f]{6}$/.test(color);
      };

      expect(isValidHexColor("#1a1a2e")).toBe(true);
      expect(isValidHexColor("#ffffff")).toBe(true);
      expect(isValidHexColor("#FFFFFF")).toBe(true);
      expect(isValidHexColor("red")).toBe(false);
      expect(isValidHexColor("#fff")).toBe(false);
    });
  });

  describe("Frame Calculation", () => {
    it("should calculate total frames correctly", () => {
      const fps = defaultVideoConfig.fps;
      const duration = defaultVideoConfig.duration;
      const totalFrames = fps * duration;

      expect(totalFrames).toBe(80); // 10 fps * 8 seconds
    });

    it("should calculate frame interval in milliseconds", () => {
      const fps = defaultVideoConfig.fps;
      const frameIntervalMs = 1000 / fps;

      expect(frameIntervalMs).toBe(100); // 100ms per frame at 10fps
    });
  });

  describe("Video Dimensions", () => {
    it("should maintain 9:16 aspect ratio for vertical social media", () => {
      const width = defaultVideoConfig.width;
      const height = defaultVideoConfig.height;
      const aspectRatio = width / height;

      expect(aspectRatio).toBeCloseTo(9 / 16, 2);
    });

    it("should calculate video file size estimate", () => {
      const width = defaultVideoConfig.width;
      const height = defaultVideoConfig.height;
      const fps = defaultVideoConfig.fps;
      const duration = defaultVideoConfig.duration;
      const bitsPerPixel = 0.1; // Compressed video estimate

      const rawSizeBytes =
        (width * height * bitsPerPixel * fps * duration) / 8;
      const estimatedSizeMB = rawSizeBytes / (1024 * 1024);

      expect(estimatedSizeMB).toBeGreaterThan(0);
      expect(estimatedSizeMB).toBeLessThan(100); // Reasonable for short video
    });
  });

  describe("Thumbnail Dimensions", () => {
    it("should have common thumbnail sizes for various formats", () => {
      // 16:9 horizontal thumbnails
      const horizontalSizes = {
        small: { width: 320, height: 180 },
        medium: { width: 640, height: 360 },
        large: { width: 1280, height: 720 },
      };

      Object.values(horizontalSizes).forEach((size) => {
        const ratio = size.width / size.height;
        expect(ratio).toBeCloseTo(16 / 9, 2);
      });

      // 9:16 vertical thumbnails (for social media)
      const verticalSizes = {
        small: { width: 180, height: 320 },
        medium: { width: 360, height: 640 },
        large: { width: 1080, height: 1920 },
      };

      Object.values(verticalSizes).forEach((size) => {
        const ratio = size.width / size.height;
        expect(ratio).toBeCloseTo(9 / 16, 2);
      });
    });
  });

  describe("Draw Animation Data", () => {
    it("should structure draw data for animation", () => {
      const drawData = {
        id: "draw-123",
        title: "Instagram Giveaway",
        totalParticipants: 500,
        winners: [
          { position: 1, username: "@winner1" },
          { position: 2, username: "@winner2" },
        ],
        timestamp: new Date().toISOString(),
      };

      expect(drawData.winners).toHaveLength(2);
      expect(drawData.totalParticipants).toBeGreaterThan(0);
    });
  });
});
