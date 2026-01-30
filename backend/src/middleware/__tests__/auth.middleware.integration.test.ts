/**
 * Auth Middleware Integration Tests
 * Tests for JWT authentication middleware
 */

import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Set test environment
process.env.JWT_SECRET = "test-secret-for-middleware-tests";

// Mock logger
jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

// Import after setting env
import { authenticate, authorize, optionalAuth } from "../auth.middleware";
import config from "../../config/config";

describe("Auth Middleware Integration", () => {
  let mockReq: any;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockReq = {
      headers: {},
    };

    mockRes = {
      status: statusMock,
      json: jsonMock,
    };

    mockNext = jest.fn();
  });

  describe("authenticate", () => {
    it("should reject request without authorization header", async () => {
      await authenticate(mockReq, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject request with non-Bearer token", async () => {
      mockReq.headers = { authorization: "Basic abc123" };

      await authenticate(mockReq, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
    });

    it("should authenticate with valid JWT", async () => {
      const secret = config.jwt.secret;
      const payload = { userId: "user-123", email: "test@example.com", role: "user" };
      const token = jwt.sign(payload, secret);
      mockReq.headers = { authorization: `Bearer ${token}` };

      await authenticate(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.id).toBe("user-123");
    });

    it("should handle malformed tokens", async () => {
      mockReq.headers = { authorization: "Bearer not.a.valid.jwt" };

      await authenticate(mockReq, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
    });
  });

  describe("authorize", () => {
    it("should reject if no user attached", () => {
      const middleware = authorize("admin");
      
      middleware(mockReq, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
    });

    it("should allow user with correct role", () => {
      mockReq.user = { id: "123", email: "test@test.com", role: "admin" };
      const middleware = authorize("admin");

      middleware(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should allow user with any matching role", () => {
      mockReq.user = { id: "123", email: "test@test.com", role: "editor" };
      const middleware = authorize("admin", "editor");

      middleware(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should reject user with wrong role", () => {
      mockReq.user = { id: "123", email: "test@test.com", role: "user" };
      const middleware = authorize("admin");

      middleware(mockReq, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(403);
    });
  });

  describe("optionalAuth", () => {
    it("should proceed without token", async () => {
      await optionalAuth(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
    });

    it("should attach user with valid token", async () => {
      const secret = config.jwt.secret;
      const payload = { userId: "user-456", email: "optional@test.com", role: "user" };
      const token = jwt.sign(payload, secret);
      mockReq.headers = { authorization: `Bearer ${token}` };

      await optionalAuth(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
    });

    it("should proceed without error on invalid token", async () => {
      mockReq.headers = { authorization: "Bearer invalid" };

      await optionalAuth(mockReq, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
