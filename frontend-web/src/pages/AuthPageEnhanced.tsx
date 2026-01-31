import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trophy, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

// Enhanced validation schemas with better error messages
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name can only contain letters, spaces, hyphens and apostrophes",
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character (@$!%*?&#)",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPageEnhanced() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, register: registerUser, isLoading } = useAuthStore();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const watchPassword = registerForm.watch("password", "");

  const handleLogin = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      setShowSuccess(true);
      toast.success("Welcome back!", {
        icon: "👋",
        duration: 2000,
      });

      // Delay navigation to show success animation
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      // Enhanced error handling
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage, {
        duration: 4000,
      });

      // Focus on email field for retry
      loginForm.setFocus("email");
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setShowSuccess(true);
      toast.success("Account created successfully! Welcome aboard!", {
        duration: 3000,
      });

      // Show welcome message about free credits
      setTimeout(() => {
        toast.success("You received 3 free credits to get started!", {
          duration: 4000,
        });
      }, 1500);

      // Delay navigation to show success animation
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      // Enhanced error handling with specific messages
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      if (error.response?.status === 409) {
        toast.error(
          "This email is already registered. Try logging in instead.",
          {
            duration: 5000,
          },
        );
        registerForm.setError("email", {
          type: "manual",
          message: "Email already exists",
        });
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            if (Array.isArray(messages)) {
              registerForm.setError(field as any, {
                type: "manual",
                message: messages[0],
              });
            }
          },
        );
        toast.error("Please check the form for errors", {
          duration: 4000,
        });
      } else {
        toast.error(errorMessage, {
          duration: 4000,
        });
      }

      // Focus on first error field
      const firstError = Object.keys(registerForm.formState.errors)[0];
      if (firstError) {
        registerForm.setFocus(firstError as any);
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    loginForm.reset();
    registerForm.reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-bg-primary py-12 px-4">
      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white"
            >
              {isLogin ? "Welcome Back!" : "Account Created!"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-ink-secondary mt-2"
            >
              Redirecting to your dashboard...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-ink-secondary">
                {isLogin
                  ? "Sign in to continue to your draws"
                  : "Start creating fair contest draws today"}
              </p>
            </div>

            <div className="card">
              {/* Tab Switcher */}
              <div
                className="flex mb-6 bg-bg-elevated rounded-lg p-1"
                role="tablist"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={isLogin}
                  aria-controls="login-panel"
                  onClick={() => !isLoading && setIsLogin(true)}
                  disabled={isLoading}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLogin
                      ? "bg-accent-secondary text-white shadow-sm"
                      : "text-ink-secondary hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={!isLogin}
                  aria-controls="register-panel"
                  onClick={() => !isLoading && setIsLogin(false)}
                  disabled={isLoading}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    !isLogin
                      ? "bg-accent-secondary text-white shadow-sm"
                      : "text-ink-secondary hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.div
                    key="login"
                    id="login-panel"
                    role="tabpanel"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form
                      onSubmit={loginForm.handleSubmit(handleLogin)}
                      className="space-y-4"
                      noValidate
                    >
                      {/* Email Field */}
                      <div>
                        <label
                          htmlFor="login-email"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          id="login-email"
                          type="email"
                          autoComplete="email"
                          aria-invalid={!!loginForm.formState.errors.email}
                          aria-describedby={
                            loginForm.formState.errors.email
                              ? "login-email-error"
                              : undefined
                          }
                          {...loginForm.register("email")}
                          className={`input-field ${
                            loginForm.formState.errors.email
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                          placeholder="you@example.com"
                        />
                        {loginForm.formState.errors.email && (
                          <p
                            id="login-email-error"
                            className="mt-1 text-sm text-red-600"
                            role="alert"
                          >
                            {loginForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div>
                        <label
                          htmlFor="login-password"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            aria-invalid={!!loginForm.formState.errors.password}
                            aria-describedby={
                              loginForm.formState.errors.password
                                ? "login-password-error"
                                : undefined
                            }
                            {...loginForm.register("password")}
                            className={`input-field pr-10 ${
                              loginForm.formState.errors.password
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {loginForm.formState.errors.password && (
                          <p
                            id="login-password-error"
                            className="mt-1 text-sm text-red-600"
                            role="alert"
                          >
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                          >
                            Forgot password?
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        aria-busy={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span>Signing in...</span>
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    id="register-panel"
                    role="tabpanel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form
                      onSubmit={registerForm.handleSubmit(handleRegister)}
                      className="space-y-4"
                      noValidate
                    >
                      {/* Name Field */}
                      <div>
                        <label
                          htmlFor="register-name"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Full Name
                        </label>
                        <input
                          id="register-name"
                          type="text"
                          autoComplete="name"
                          aria-invalid={!!registerForm.formState.errors.name}
                          aria-describedby={
                            registerForm.formState.errors.name
                              ? "register-name-error"
                              : undefined
                          }
                          {...registerForm.register("name")}
                          className={`input-field ${
                            registerForm.formState.errors.name
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                          placeholder="John Doe"
                        />
                        {registerForm.formState.errors.name && (
                          <p
                            id="register-name-error"
                            className="mt-1 text-sm text-red-600"
                            role="alert"
                          >
                            {registerForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div>
                        <label
                          htmlFor="register-email"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          id="register-email"
                          type="email"
                          autoComplete="email"
                          aria-invalid={!!registerForm.formState.errors.email}
                          aria-describedby={
                            registerForm.formState.errors.email
                              ? "register-email-error"
                              : undefined
                          }
                          {...registerForm.register("email")}
                          className={`input-field ${
                            registerForm.formState.errors.email
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                          placeholder="you@example.com"
                        />
                        {registerForm.formState.errors.email && (
                          <p
                            id="register-email-error"
                            className="mt-1 text-sm text-red-600"
                            role="alert"
                          >
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div>
                        <label
                          htmlFor="register-password"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            aria-invalid={
                              !!registerForm.formState.errors.password
                            }
                            aria-describedby={
                              registerForm.formState.errors.password
                                ? "register-password-error"
                                : "password-strength"
                            }
                            {...registerForm.register("password")}
                            className={`input-field pr-10 ${
                              registerForm.formState.errors.password
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {registerForm.formState.errors.password && (
                          <p
                            id="register-password-error"
                            className="mt-1 text-sm text-red-600"
                            role="alert"
                          >
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                        <div id="password-strength" aria-live="polite">
                          <PasswordStrengthIndicator password={watchPassword} />
                        </div>
                      </div>

                      {/* Confirm Password Field */}
                      <div>
                        <label
                          htmlFor="register-confirm-password"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            id="register-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            aria-invalid={
                              !!registerForm.formState.errors.confirmPassword
                            }
                            aria-describedby={
                              registerForm.formState.errors.confirmPassword
                                ? "register-confirm-password-error"
                                : undefined
                            }
                            {...registerForm.register("confirmPassword")}
                            className={`input-field pr-10 ${
                              registerForm.formState.errors.confirmPassword
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label={
                              showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {registerForm.formState.errors.confirmPassword && (
                          <p
                            id="register-confirm-password-error"
                            className="mt-1 text-sm text-red-600"
                            role="alert"
                          >
                            {
                              registerForm.formState.errors.confirmPassword
                                .message
                            }
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        aria-busy={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span>Creating account...</span>
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle Link */}
              <div className="mt-6 text-center text-sm text-white">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  type="button"
                  onClick={toggleMode}
                  disabled={isLoading}
                  className="text-accent-primary hover:text-accent-secondary font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
