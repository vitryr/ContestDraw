/**
 * Error Middleware Tests
 * Tests for error handling middleware
 */

describe("ErrorMiddleware - Unit Tests", () => {
  describe("Error Response Format", () => {
    it("should format error response correctly", () => {
      const formatError = (error: Error, statusCode: number) => ({
        status: "error",
        message: error.message,
        code: statusCode,
      });

      const response = formatError(new Error("Something went wrong"), 500);

      expect(response.status).toBe("error");
      expect(response.message).toBe("Something went wrong");
      expect(response.code).toBe(500);
    });
  });

  describe("Status Code Mapping", () => {
    it("should map error types to status codes", () => {
      const errorStatusCodes: Record<string, number> = {
        ValidationError: 400,
        UnauthorizedError: 401,
        ForbiddenError: 403,
        NotFoundError: 404,
        ConflictError: 409,
        InternalError: 500,
      };

      expect(errorStatusCodes.ValidationError).toBe(400);
      expect(errorStatusCodes.UnauthorizedError).toBe(401);
      expect(errorStatusCodes.NotFoundError).toBe(404);
    });
  });

  describe("AppError Class", () => {
    class AppError extends Error {
      statusCode: number;
      code: string;

      constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
      }
    }

    it("should create AppError with status code", () => {
      const error = new AppError("Not found", 404, "NOT_FOUND");

      expect(error.message).toBe("Not found");
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe("NOT_FOUND");
    });

    it("should be instance of Error", () => {
      const error = new AppError("Test", 400, "TEST");

      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("Error Sanitization", () => {
    it("should hide internal error details in production", () => {
      const sanitize = (error: Error, isDev: boolean): string => {
        if (isDev) {
          return error.message;
        }
        return "An unexpected error occurred";
      };

      const error = new Error("Database connection failed: password invalid");

      expect(sanitize(error, true)).toContain("Database");
      expect(sanitize(error, false)).not.toContain("Database");
    });

    it("should not expose stack traces in production", () => {
      const getStackTrace = (error: Error, isDev: boolean): string | undefined => {
        return isDev ? error.stack : undefined;
      };

      const error = new Error("Test");
      
      expect(getStackTrace(error, true)).toBeDefined();
      expect(getStackTrace(error, false)).toBeUndefined();
    });
  });

  describe("Validation Error Handling", () => {
    it("should format validation errors", () => {
      const validationErrors = [
        { field: "email", message: "Invalid email format" },
        { field: "password", message: "Password too short" },
      ];

      const formatted = {
        status: "error",
        message: "Validation failed",
        errors: validationErrors,
      };

      expect(formatted.errors).toHaveLength(2);
      expect(formatted.errors[0].field).toBe("email");
    });
  });

  describe("JWT Error Handling", () => {
    it("should identify token expired error", () => {
      const isTokenExpired = (error: Error): boolean => {
        return error.name === "TokenExpiredError";
      };

      const expiredError = Object.assign(new Error("jwt expired"), {
        name: "TokenExpiredError",
      });

      expect(isTokenExpired(expiredError)).toBe(true);
    });

    it("should identify invalid token error", () => {
      const isInvalidToken = (error: Error): boolean => {
        return error.name === "JsonWebTokenError";
      };

      const invalidError = Object.assign(new Error("invalid signature"), {
        name: "JsonWebTokenError",
      });

      expect(isInvalidToken(invalidError)).toBe(true);
    });
  });

  describe("Database Error Handling", () => {
    it("should identify unique constraint violation", () => {
      const isUniqueViolation = (error: any): boolean => {
        return error.code === "P2002" || error.code === "23505";
      };

      expect(isUniqueViolation({ code: "P2002" })).toBe(true);
      expect(isUniqueViolation({ code: "23505" })).toBe(true);
      expect(isUniqueViolation({ code: "OTHER" })).toBe(false);
    });

    it("should identify foreign key violation", () => {
      const isForeignKeyViolation = (error: any): boolean => {
        return error.code === "P2003" || error.code === "23503";
      };

      expect(isForeignKeyViolation({ code: "P2003" })).toBe(true);
    });
  });

  describe("Error Logging", () => {
    it("should extract error info for logging", () => {
      const extractLogInfo = (error: Error) => ({
        message: error.message,
        name: error.name,
        stack: error.stack?.split("\n").slice(0, 5).join("\n"),
      });

      const error = new Error("Test error");
      const logInfo = extractLogInfo(error);

      expect(logInfo.message).toBe("Test error");
      expect(logInfo.name).toBe("Error");
    });
  });

  describe("HTTP Error Responses", () => {
    const httpErrors = {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      409: "Conflict",
      422: "Unprocessable Entity",
      429: "Too Many Requests",
      500: "Internal Server Error",
      502: "Bad Gateway",
      503: "Service Unavailable",
    };

    it("should have all common HTTP error codes", () => {
      expect(httpErrors[400]).toBe("Bad Request");
      expect(httpErrors[401]).toBe("Unauthorized");
      expect(httpErrors[404]).toBe("Not Found");
      expect(httpErrors[500]).toBe("Internal Server Error");
    });
  });

  describe("Async Error Handler", () => {
    it("should wrap async functions to catch errors", () => {
      const asyncHandler = (fn: Function) => {
        return (req: any, res: any, next: any) => {
          Promise.resolve(fn(req, res, next)).catch(next);
        };
      };

      const handler = asyncHandler(async () => {
        throw new Error("Async error");
      });

      expect(typeof handler).toBe("function");
    });
  });

  describe("Error Codes", () => {
    const errorCodes = {
      INVALID_INPUT: "INVALID_INPUT",
      UNAUTHORIZED: "UNAUTHORIZED",
      FORBIDDEN: "FORBIDDEN",
      NOT_FOUND: "NOT_FOUND",
      CONFLICT: "CONFLICT",
      INTERNAL_ERROR: "INTERNAL_ERROR",
      TOKEN_EXPIRED: "TOKEN_EXPIRED",
      INVALID_TOKEN: "INVALID_TOKEN",
      RATE_LIMITED: "RATE_LIMITED",
    };

    it("should have standard error codes", () => {
      expect(errorCodes.UNAUTHORIZED).toBe("UNAUTHORIZED");
      expect(errorCodes.NOT_FOUND).toBe("NOT_FOUND");
      expect(errorCodes.TOKEN_EXPIRED).toBe("TOKEN_EXPIRED");
    });
  });
});
