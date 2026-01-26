/**
 * Form validation utilities
 */

export interface PasswordStrength {
  score: number; // 0-4
  label: "Weak" | "Fair" | "Good" | "Strong" | "Very Strong";
  color: string;
  suggestions: string[];
}

/**
 * Calculate password strength
 * @param password - Password to analyze
 * @returns Password strength object
 */
export const calculatePasswordStrength = (
  password: string,
): PasswordStrength => {
  let score = 0;
  const suggestions: string[] = [];

  if (!password) {
    return {
      score: 0,
      label: "Weak",
      color: "text-red-600",
      suggestions: ["Enter a password"],
    };
  }

  // Length check
  if (password.length >= 8) score++;
  else suggestions.push("Use at least 8 characters");

  if (password.length >= 12) score++;

  // Character variety checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score++;
  } else {
    suggestions.push("Mix uppercase and lowercase letters");
  }

  if (/\d/.test(password)) {
    score++;
  } else {
    suggestions.push("Include numbers");
  }

  if (/[@$!%*?&#]/.test(password)) {
    score++;
  } else {
    suggestions.push("Add special characters (@$!%*?&#)");
  }

  // Determine label and color
  const strengthMap: Record<
    number,
    { label: PasswordStrength["label"]; color: string }
  > = {
    0: { label: "Weak", color: "text-red-600" },
    1: { label: "Weak", color: "text-red-600" },
    2: { label: "Fair", color: "text-orange-600" },
    3: { label: "Good", color: "text-yellow-600" },
    4: { label: "Strong", color: "text-green-600" },
    5: { label: "Very Strong", color: "text-green-700" },
  };

  const strength = strengthMap[score] || strengthMap[0];

  return {
    score: Math.min(score, 5),
    label: strength.label,
    color: strength.color,
    suggestions,
  };
};

/**
 * Validate email format
 * @param email - Email to validate
 * @returns True if valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password meets requirements
 * @param password - Password to validate
 * @returns Object with valid flag and error message
 */
export const validatePassword = (
  password: string,
): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }

  if (password.length > 128) {
    return { valid: false, error: "Password must be less than 128 characters" };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain lowercase letters" };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain uppercase letters" };
  }

  if (!/\d/.test(password)) {
    return { valid: false, error: "Password must contain numbers" };
  }

  if (!/[@$!%*?&#]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain special characters (@$!%*?&#)",
    };
  }

  return { valid: true };
};

/**
 * Sanitize name input
 * @param name - Name to sanitize
 * @returns Sanitized name
 */
export const sanitizeName = (name: string): string => {
  return name.trim().replace(/\s+/g, " ");
};

/**
 * Check if passwords match
 * @param password - First password
 * @param confirmPassword - Confirmation password
 * @returns True if they match
 */
export const passwordsMatch = (
  password: string,
  confirmPassword: string,
): boolean => {
  return password === confirmPassword && password.length > 0;
};
