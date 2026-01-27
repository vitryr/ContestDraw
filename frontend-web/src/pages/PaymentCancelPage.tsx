import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-gray-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>

          <p className="text-gray-600 mb-8">
            Your payment was cancelled. No charges were made to your account.
            You can try again whenever you're ready.
          </p>

          <div className="space-y-3">
            <Link
              to="/buy-credits"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Pricing
            </Link>

            <Link
              to="/dashboard"
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Need help?</p>
              <p>
                If you experienced any issues during checkout, please{" "}
                <a
                  href="mailto:support@cleack.io"
                  className="underline hover:no-underline"
                >
                  contact our support team
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
