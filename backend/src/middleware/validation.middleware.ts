import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { ValidationError } from "./error.middleware";

/**
 * Middleware to handle validation errors from express-validator
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for errors
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    // Format errors
    const formattedErrors = errors.array().map((err) => ({
      field: err.type === "field" ? (err as any).path : "unknown",
      message: err.msg,
    }));

    // Throw validation error
    next(new ValidationError(formattedErrors));
  };
};

/**
 * Common validation rules
 */
export const validationRules = {
  email: {
    isEmail: {
      errorMessage: "Invalid email address",
    },
    normalizeEmail: true,
  },

  password: {
    isLength: {
      options: { min: 8, max: 128 },
      errorMessage: "Password must be between 8 and 128 characters",
    },
    matches: {
      options:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      errorMessage:
        "Password must contain uppercase, lowercase, number and special character",
    },
  },

  uuid: {
    isUUID: {
      errorMessage: "Invalid ID format",
    },
  },

  positiveInteger: {
    isInt: {
      options: { min: 1 },
      errorMessage: "Must be a positive integer",
    },
    toInt: true,
  },

  url: {
    isURL: {
      errorMessage: "Invalid URL format",
    },
  },
};
