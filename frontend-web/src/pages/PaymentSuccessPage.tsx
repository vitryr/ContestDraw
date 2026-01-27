import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Mail, ArrowRight, Download } from "lucide-react";
import { useCreditsStore } from "../store/useCreditsStore";
import confetti from "canvas-confetti";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { fetchBalance } = useCreditsStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Refresh credit balance
    const refreshBalance = async () => {
      try {
        await fetchBalance();
      } finally {
        setIsLoading(false);
      }
    };

    refreshBalance();
  }, [fetchBalance]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-primary-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your credits have been added to your
            account and are ready to use.
          </p>

          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="font-mono text-sm text-gray-700 break-all">
                {sessionId}
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-8">
            <Mail className="w-4 h-4" />
            <span>A receipt has been sent to your email</span>
          </div>

          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/draw/new"
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              Create a Draw
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{" "}
          <a
            href="mailto:support@cleack.io"
            className="text-primary-600 hover:underline"
          >
            Contact support
          </a>
        </p>
      </motion.div>
    </div>
  );
}
