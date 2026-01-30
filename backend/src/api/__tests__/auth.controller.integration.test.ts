/**
 * Auth Controller Integration Tests
 * Tests for authentication API endpoints
 */

import { Request, Response, NextFunction } from "express";

// Mock services
jest.mock("../../services/auth.service", () => ({
  authService: {
    register: jest.fn(),
    login: jest.fn(),
    verifyEmail: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
    refreshToken: jest.fn(),
  },
}));

jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

import { authService } from "../../services/auth.service";
import * as authController from "../auth/auth.controller.v2";

describe("Auth Controller Integration", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn().mockReturnThis();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockReq = {
      body: {},
      params: {},
      query: {},
      cookies: {},
    };

    mockRes = {
      status: statusMock,
      json: jsonMock,
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  describe("POST /register", () => {
    it("should register user and return 201", async () => {
      const mockUser = { id: "user-123", email: "test@example.com" };
      const mockTokens = { accessToken: "access", refreshToken: "refresh" };

      mockReq.body = {
        email: "test@example.com",
        password: "Password123!",
        firstName: "John",
        lastName: "Doe",
      };

      (authService.register as jest.Mock).mockResolvedValue({
        user: mockUser,
        tokens: mockTokens,
      });

      await authController.register(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(authService.register).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Password123!",
        firstName: "John",
        lastName: "Doe",
      });
      expect(statusMock).toHaveBeenCalledWith(201);
    });

    it("should call register service with body data", async () => {
      mockReq.body = { email: "another@test.com", password: "Pass123!" };

      (authService.register as jest.Mock).mockResolvedValue({
        user: { id: "new-user" },
        tokens: { accessToken: "t" },
      });

      await authController.register(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(authService.register).toHaveBeenCalled();
    });
  });

  describe("POST /login", () => {
    it("should login with valid credentials", async () => {
      mockReq.body = { email: "test@test.com", password: "Password123!" };

      (authService.login as jest.Mock).mockResolvedValue({
        user: { id: "123", email: "test@test.com" },
        tokens: { accessToken: "token", refreshToken: "refresh" },
      });

      await authController.login(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it("should call login service", async () => {
      mockReq.body = { email: "user@test.com", password: "Password1!" };

      (authService.login as jest.Mock).mockResolvedValue({
        user: { id: "user-id" },
        tokens: { accessToken: "tok" },
      });

      await authController.login(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(authService.login).toHaveBeenCalled();
    });
  });

  describe("POST /verify-email", () => {
    it("should verify email with valid token", async () => {
      mockReq.body = { token: "valid-token" };
      (authService.verifyEmail as jest.Mock).mockResolvedValue(undefined);

      await authController.verifyEmail(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(200);
    });
  });

  describe("POST /forgot-password", () => {
    it("should send reset email", async () => {
      mockReq.body = { email: "test@test.com" };
      (authService.requestPasswordReset as jest.Mock).mockResolvedValue(undefined);

      await authController.forgotPassword(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(authService.requestPasswordReset).toHaveBeenCalledWith("test@test.com");
      expect(statusMock).toHaveBeenCalledWith(200);
    });
  });

  describe("POST /reset-password", () => {
    it("should reset password with valid token", async () => {
      mockReq.body = { token: "reset-token", password: "NewPass123!" };
      (authService.resetPassword as jest.Mock).mockResolvedValue(undefined);

      await authController.resetPassword(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(200);
    });
  });

  describe("POST /refresh-token", () => {
    it("should refresh tokens", async () => {
      mockReq.body = { refreshToken: "valid-refresh" };

      (authService.refreshToken as jest.Mock).mockResolvedValue({
        accessToken: "new-access",
        refreshToken: "new-refresh",
      });

      await authController.refreshToken(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(200);
    });
  });

  describe("POST /logout", () => {
    it("should return 200 on logout", async () => {
      await authController.logout(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(200);
    });
  });
});
