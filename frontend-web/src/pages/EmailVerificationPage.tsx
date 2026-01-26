import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Mail, Loader2 } from "lucide-react";
import { authApi } from "../services/api";
import toast from "react-hot-toast";

type VerificationStatus = "pending" | "success" | "error";

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>("pending");
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage(
        "Invalid verification link. Please check your email and try again.",
      );
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await authApi.verifyEmail(token);
      setStatus("success");
      setMessage(response.message || "Email verified successfully!");
      toast.success("Email verified! You can now sign in.", {
        duration: 4000,
        icon: "✅",
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    } catch (error: any) {
      setStatus("error");
      const errorMessage =
        error.response?.data?.message ||
        "Verification failed. The link may have expired or is invalid.";
      setMessage(errorMessage);
      toast.error(errorMessage, {
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{
              backgroundColor:
                status === "pending"
                  ? "#E5E7EB"
                  : status === "success"
                    ? "#D1FAE5"
                    : "#FEE2E2",
            }}
          >
            {status === "pending" && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-10 h-10 text-gray-600" />
              </motion.div>
            )}
            {status === "success" && (
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            )}
            {status === "error" && (
              <XCircle className="w-10 h-10 text-red-600" />
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            {status === "pending" && "Verifying Email"}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-6"
          >
            {message}
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            {status === "success" && (
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
            )}

            {status === "error" && (
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/auth")}
                  className="w-full btn-primary"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full btn-secondary"
                >
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>
              Didn't receive the email?{" "}
              <button
                onClick={() => navigate("/auth")}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Contact support
              </button>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
