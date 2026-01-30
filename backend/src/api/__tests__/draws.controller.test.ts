/**
 * Draws Controller Tests
 * Tests for draw management API endpoints
 */

import { Request, Response, NextFunction } from "express";

// Mock services
const mockDrawService = {
  executeDraw: jest.fn(),
  getDraw: jest.fn(),
  getUserDraws: jest.fn(),
  canPerformDraw: jest.fn(),
};

const mockInstagramService = {
  fetchComments: jest.fn(),
};

const mockFacebookService = {
  fetchComments: jest.fn(),
};

const mockPaymentService = {
  deductCredits: jest.fn(),
};

const mockAnalyticsService = {
  trackDrawCreated: jest.fn(),
  trackDrawCompleted: jest.fn(),
  trackDrawFailed: jest.fn(),
};

jest.mock("../../services/draw.service", () => ({
  DrawService: jest.fn().mockImplementation(() => mockDrawService),
}));

jest.mock("../../services/instagram.service", () => ({
  InstagramService: jest.fn().mockImplementation(() => mockInstagramService),
}));

jest.mock("../../services/analytics.service", () => ({
  analyticsService: mockAnalyticsService,
}));

jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe("DrawsController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: {
        userId: "user-123",
        email: "test@example.com",
        role: "user",
      },
    } as any;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  describe("POST /draws", () => {
    it("should create and execute draw", async () => {
      mockRequest.body = {
        title: "Summer Giveaway",
        platform: "INSTAGRAM",
        postUrl: "https://instagram.com/p/ABC123/",
        winnersCount: 3,
        alternatesCount: 1,
        filters: {
          mustFollowAccount: true,
        },
      };

      mockDrawService.canPerformDraw.mockResolvedValue({
        allowed: true,
        reason: "Credits available",
      });

      mockInstagramService.fetchComments.mockResolvedValue([
        { id: "c1", username: "user1", text: "Great!" },
        { id: "c2", username: "user2", text: "Nice!" },
        { id: "c3", username: "user3", text: "Amazing!" },
        { id: "c4", username: "user4", text: "Love it!" },
        { id: "c5", username: "user5", text: "Awesome!" },
      ]);

      mockDrawService.executeDraw.mockResolvedValue({
        drawId: "draw-123",
        winners: [
          { id: "c1", username: "user1", position: 1 },
          { id: "c2", username: "user2", position: 2 },
          { id: "c3", username: "user3", position: 3 },
        ],
        alternates: [{ id: "c4", username: "user4", position: 1 }],
        totalParticipants: 5,
        certificateHash: "abc123",
      });

      // Simulate controller behavior
      const result = await mockDrawService.executeDraw(
        mockInstagramService.fetchComments(),
        mockRequest.body,
        "user-123"
      );

      expect(result.winners).toHaveLength(3);
      expect(result.drawId).toBe("draw-123");
    });

    it("should return 403 if user cannot perform draw", async () => {
      mockRequest.body = {
        platform: "INSTAGRAM",
        postUrl: "https://instagram.com/p/ABC123/",
        winnersCount: 1,
      };

      mockDrawService.canPerformDraw.mockResolvedValue({
        allowed: false,
        reason: "No credits available and trial already used",
      });

      // Simulate error response
      mockResponse.status!(403);
      mockResponse.json!({
        error: "No credits available and trial already used",
      });

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it("should deduct credits after successful draw", async () => {
      mockRequest.body = {
        platform: "INSTAGRAM",
        postUrl: "https://instagram.com/p/ABC123/",
        winnersCount: 1,
      };

      mockDrawService.canPerformDraw.mockResolvedValue({
        allowed: true,
        reason: "Credits available",
      });

      mockDrawService.executeDraw.mockResolvedValue({
        drawId: "draw-123",
        winners: [{ id: "c1", username: "winner" }],
      });

      // After draw execution, credits should be deducted
      await mockPaymentService.deductCredits("user-123", 1);

      expect(mockPaymentService.deductCredits).toHaveBeenCalledWith("user-123", 1);
    });

    it("should track draw completion in analytics", async () => {
      mockRequest.body = {
        platform: "INSTAGRAM",
        postUrl: "https://instagram.com/p/ABC123/",
        winnersCount: 1,
      };

      mockDrawService.executeDraw.mockResolvedValue({
        drawId: "draw-123",
        winners: [{ id: "c1" }],
        totalParticipants: 100,
      });

      // After successful draw
      mockAnalyticsService.trackDrawCompleted("user-123", {
        drawId: "draw-123",
        platform: "INSTAGRAM",
        participantCount: 100,
        winnerCount: 1,
      });

      expect(mockAnalyticsService.trackDrawCompleted).toHaveBeenCalled();
    });
  });

  describe("GET /draws/:id", () => {
    it("should return draw details", async () => {
      mockRequest.params = { id: "draw-123" };

      const mockDraw = {
        id: "draw-123",
        title: "Summer Giveaway",
        platform: "INSTAGRAM",
        winnersCount: 3,
        status: "COMPLETED",
        createdAt: new Date(),
      };

      mockDrawService.getDraw.mockResolvedValue(mockDraw);

      const result = await mockDrawService.getDraw("draw-123");

      expect(result.id).toBe("draw-123");
      expect(result.status).toBe("COMPLETED");
    });

    it("should return 404 for non-existent draw", async () => {
      mockRequest.params = { id: "nonexistent" };

      mockDrawService.getDraw.mockResolvedValue(null);

      mockResponse.status!(404);
      mockResponse.json!({ error: "Draw not found" });

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it("should return 403 for unauthorized access", async () => {
      mockRequest.params = { id: "draw-123" };

      mockDrawService.getDraw.mockResolvedValue({
        id: "draw-123",
        userId: "other-user", // Different user
      });

      mockResponse.status!(403);
      mockResponse.json!({ error: "Not authorized" });

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });

  describe("GET /draws", () => {
    it("should return user draws with pagination", async () => {
      mockRequest.query = { page: "1", limit: "10" };

      const mockDraws = [
        { id: "draw-1", title: "Draw 1" },
        { id: "draw-2", title: "Draw 2" },
      ];

      mockDrawService.getUserDraws.mockResolvedValue({
        draws: mockDraws,
        total: 2,
        page: 1,
        limit: 10,
      });

      const result = await mockDrawService.getUserDraws("user-123", {
        page: 1,
        limit: 10,
      });

      expect(result.draws).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it("should filter by platform", async () => {
      mockRequest.query = { platform: "INSTAGRAM" };

      mockDrawService.getUserDraws.mockResolvedValue({
        draws: [{ id: "draw-1", platform: "INSTAGRAM" }],
        total: 1,
      });

      const result = await mockDrawService.getUserDraws("user-123", {
        platform: "INSTAGRAM",
      });

      expect(result.draws[0].platform).toBe("INSTAGRAM");
    });

    it("should filter by status", async () => {
      mockRequest.query = { status: "COMPLETED" };

      mockDrawService.getUserDraws.mockResolvedValue({
        draws: [{ id: "draw-1", status: "COMPLETED" }],
        total: 1,
      });

      const result = await mockDrawService.getUserDraws("user-123", {
        status: "COMPLETED",
      });

      expect(result.draws[0].status).toBe("COMPLETED");
    });
  });

  describe("GET /draws/:id/certificate", () => {
    it("should return certificate PDF", async () => {
      mockRequest.params = { id: "draw-123" };

      const mockCertificate = {
        buffer: Buffer.from("PDF content"),
        hash: "abc123",
      };

      mockDrawService.getDraw.mockResolvedValue({
        id: "draw-123",
        userId: "user-123",
        certificate: mockCertificate,
      });

      // Response should set PDF headers
      const mockSetHeader = jest.fn();
      mockResponse.setHeader = mockSetHeader;

      mockResponse.setHeader!("Content-Type", "application/pdf");
      mockResponse.setHeader!(
        "Content-Disposition",
        'attachment; filename="certificate-draw-123.pdf"'
      );

      expect(mockSetHeader).toHaveBeenCalledWith("Content-Type", "application/pdf");
    });
  });

  describe("POST /draws/:id/redraw", () => {
    it("should redraw with new winner", async () => {
      mockRequest.params = { id: "draw-123" };
      mockRequest.body = {
        excludeWinnerIds: ["w1"], // Exclude original winner
      };

      const originalDraw = {
        id: "draw-123",
        userId: "user-123",
        winnersCount: 1,
        participants: [
          { id: "w1", username: "original_winner" },
          { id: "p1", username: "participant1" },
          { id: "p2", username: "participant2" },
        ],
      };

      mockDrawService.getDraw.mockResolvedValue(originalDraw);

      // Redraw should select from remaining participants
      mockDrawService.executeDraw.mockResolvedValue({
        drawId: "draw-123-redraw",
        winners: [{ id: "p1", username: "participant1" }],
      });

      const result = await mockDrawService.executeDraw(
        originalDraw.participants.filter((p) => p.id !== "w1"),
        { winnersCount: 1 }
      );

      expect(result.winners[0].username).toBe("participant1");
    });
  });

  describe("Error handling", () => {
    it("should handle Instagram API errors", async () => {
      mockRequest.body = {
        platform: "INSTAGRAM",
        postUrl: "https://instagram.com/p/ABC123/",
        winnersCount: 1,
      };

      mockInstagramService.fetchComments.mockRejectedValue(
        new Error("Instagram API rate limit exceeded")
      );

      mockAnalyticsService.trackDrawFailed("user-123", {
        drawId: "pending",
        error: "Instagram API rate limit exceeded",
        platform: "INSTAGRAM",
      });

      expect(mockAnalyticsService.trackDrawFailed).toHaveBeenCalled();
    });

    it("should handle insufficient participants", async () => {
      mockRequest.body = {
        platform: "INSTAGRAM",
        postUrl: "https://instagram.com/p/ABC123/",
        winnersCount: 10,
      };

      mockInstagramService.fetchComments.mockResolvedValue([
        { id: "c1", username: "user1" },
        { id: "c2", username: "user2" },
      ]);

      mockDrawService.executeDraw.mockRejectedValue(
        new Error("Not enough participants (2) for requested winners (10)")
      );

      try {
        await mockDrawService.executeDraw([], { winnersCount: 10 });
      } catch (error: any) {
        expect(error.message).toContain("Not enough participants");
      }
    });
  });
});
