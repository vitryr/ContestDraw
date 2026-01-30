/**
 * Error Middleware Integration Tests
 */

import { Request, Response, NextFunction } from "express";

jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
  logError: jest.fn(),
}));

import { errorMiddleware, AppError, ValidationError, asyncHandler } from "../error.middleware";

describe("Error Middleware Integration", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockReq = {};
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    mockNext = jest.fn();
  });

  describe("AppError", () => {
    it("should create error with status code", () => {
      const error = new AppError("Not found", 404, "NOT_FOUND");

      expect(error.message).toBe("Not found");
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe("NOT_FOUND");
    });

    it("should be instance of Error", () => {
      const error = new AppError("Test", 400, "TEST");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });

    it("should default to operational error", () => {
      const error = new AppError("Ops error", 400, "OPS");

      expect(error.isOperational).toBe(true);
    });
  });

  describe("errorMiddleware", () => {
    it("should handle AppError with correct status", () => {
      const error = new AppError("Bad request", 400, "BAD_REQUEST");

      errorMiddleware(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Bad request",
        })
      );
    });

    it("should handle generic Error with 500", () => {
      const error = new Error("Something went wrong");

      errorMiddleware(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(500);
    });

    it("should include error code in response", () => {
      const error = new AppError("Forbidden", 403, "FORBIDDEN");

      errorMiddleware(error, mockReq as Request, mockRes as Response, mockNext);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: "FORBIDDEN",
        })
      );
    });
  });

  describe("asyncHandler", () => {
    it("should pass through successful async function", async () => {
      const asyncFn = jest.fn().mockResolvedValue(undefined);
      const wrapped = asyncHandler(asyncFn);

      await wrapped(mockReq as Request, mockRes as Response, mockNext);

      expect(asyncFn).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should catch async errors and pass to next", async () => {
      const error = new Error("Async error");
      const asyncFn = jest.fn().mockRejectedValue(error);
      const wrapped = asyncHandler(asyncFn);

      await wrapped(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("ValidationError", () => {
    it("should create validation error with field errors", () => {
      const errors = [
        { field: "email", message: "Invalid email" },
        { field: "password", message: "Too short" },
      ];
      const error = new ValidationError(errors);

      expect(error.message).toBe("Validation failed");
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.errors).toEqual(errors);
    });

    it("should be instance of AppError", () => {
      const error = new ValidationError([]);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe("errorMiddleware - JWT errors", () => {
    it("should handle JsonWebTokenError", () => {
      const error = Object.assign(new Error("invalid signature"), {
        name: "JsonWebTokenError",
      });

      errorMiddleware(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: "INVALID_TOKEN",
        })
      );
    });

    it("should handle TokenExpiredError", () => {
      const error = Object.assign(new Error("jwt expired"), {
        name: "TokenExpiredError",
      });

      errorMiddleware(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: "TOKEN_EXPIRED",
        })
      );
    });
  });

  describe("errorMiddleware - ValidationError", () => {
    it("should handle ValidationError with field errors", () => {
      const error = new ValidationError([
        { field: "email", message: "Required" },
      ]);

      errorMiddleware(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: [{ field: "email", message: "Required" }],
        })
      );
    });
  });
});
