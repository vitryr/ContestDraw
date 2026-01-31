import { useState } from "react";
import { CheckCircle, XCircle, Shield, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface VerifyHashProps {
  drawId: string;
  expectedHash: string;
  verified?: boolean;
}

/**
 * Hash Verification Component
 * Allows users to verify the authenticity of draw certificates
 */
export default function VerifyHash({
  drawId,
  expectedHash,
  verified = false,
}: VerifyHashProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    message: string;
  } | null>(
    verified ? { verified: true, message: "Certificate is authentic" } : null,
  );
  const [inputHash, setInputHash] = useState("");
  const [copied, setCopied] = useState(false);

  const handleVerify = async () => {
    if (!inputHash.trim()) {
      toast.error("Please enter a hash to verify");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/public/verify-hash/${drawId}`,
        { hash: inputHash },
      );

      setVerificationResult({
        verified: response.data.verified,
        message: response.data.message,
      });

      if (response.data.verified) {
        toast.success("Certificate verified successfully!");
      } else {
        toast.error("Verification failed - hash mismatch");
      }
    } catch (error) {
      toast.error("Failed to verify hash");
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const copyHash = async () => {
    try {
      await navigator.clipboard.writeText(expectedHash);
      setCopied(true);
      toast.success("Hash copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy hash");
    }
  };

  const formatHash = (hash: string): string => {
    // Format hash in blocks of 4 characters for readability
    return hash.match(/.{1,4}/g)?.join(" ") || hash;
  };

  const getVerificationCode = (hash: string): string => {
    // First 12 characters as verification code
    return hash.substring(0, 12).toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Hash Verification</h3>
        {verificationResult?.verified && (
          <span className="ml-auto flex items-center gap-1 text-green-600 font-semibold">
            <CheckCircle className="w-5 h-5" />
            Verified
          </span>
        )}
      </div>

      {/* Expected Hash Display */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-white">
            Certificate Hash (SHA-256)
          </label>
          <button
            onClick={copyHash}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
        <p className="text-xs font-mono text-gray-600 break-all leading-relaxed">
          {formatHash(expectedHash)}
        </p>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Verification Code:</p>
          <p className="text-sm font-bold text-blue-600 tracking-wider">
            {getVerificationCode(expectedHash)}
          </p>
        </div>
      </div>

      {/* Hash Input for Verification */}
      <div className="mb-4">
        <label
          htmlFor="hash-input"
          className="block text-sm font-medium text-white mb-2"
        >
          Verify Certificate Authenticity
        </label>
        <div className="flex gap-2">
          <input
            id="hash-input"
            type="text"
            value={inputHash}
            onChange={(e) => setInputHash(e.target.value)}
            placeholder="Paste certificate hash here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
          <button
            onClick={handleVerify}
            disabled={isVerifying || !inputHash.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div
          className={`rounded-lg p-4 flex items-start gap-3 ${
            verificationResult.verified
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {verificationResult.verified ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h4
              className={`font-semibold mb-1 ${
                verificationResult.verified ? "text-green-900" : "text-red-900"
              }`}
            >
              {verificationResult.verified
                ? "Verification Successful"
                : "Verification Failed"}
            </h4>
            <p
              className={`text-sm ${
                verificationResult.verified ? "text-green-700" : "text-red-700"
              }`}
            >
              {verificationResult.message}
            </p>
          </div>
        </div>
      )}

      {/* Information */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-white mb-2">
          How Hash Verification Works
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Each certificate has a unique SHA-256 hash</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>
              The hash is generated from draw results and cannot be tampered
              with
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>
              Compare your certificate's hash with the one shown above
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>
              If they match, the certificate is authentic and unmodified
            </span>
          </li>
        </ul>
      </div>

      {/* Algorithm Info */}
      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-900">
          <strong>Algorithm:</strong> Cryptographically Secure PRNG
          (crypto.randomBytes) + SHA-256 hashing
        </p>
      </div>
    </div>
  );
}
