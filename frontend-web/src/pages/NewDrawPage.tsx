import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Link2,
  Upload,
  Instagram,
  Facebook,
  Check,
  ArrowRight,
  FileText,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useDrawStore } from "../store/useDrawStore";
import type { Participant } from "../types";
import toast from "react-hot-toast";

// TikTok icon component (not in lucide)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// YouTube icon
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface DetectedPlatform {
  platform: "instagram" | "tiktok" | "facebook" | "youtube" | "twitter";
  username: string;
  postId: string;
  profilePicture?: string;
}

interface ImportProgress {
  totalComments: number;
  uniqueUsers: number;
  scanProgress: number;
  status: "fetching" | "scanning" | "complete";
}

const SUPPORTED_PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "from-[#f6339a] to-[#ff6900]" },
  { id: "tiktok", name: "TikTok", icon: TikTokIcon, color: "bg-black" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-[#1877F2]" },
];

export default function NewDrawPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createDraw, updateDraw, setParticipants, isLoading } = useDrawStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [url, setUrl] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [detectedPlatform, setDetectedPlatform] = useState<DetectedPlatform | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [inputMode, setInputMode] = useState<"url" | "csv">("url");

  // Import state
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<ImportProgress>({
    totalComments: 0,
    uniqueUsers: 0,
    scanProgress: 0,
    status: "fetching",
  });
  const [animatedCount, setAnimatedCount] = useState(0);

  // Detect platform from URL
  const detectPlatform = useCallback((inputUrl: string): DetectedPlatform | null => {
    // Instagram patterns
    const instagramPatterns = [
      /instagram\.com\/p\/([a-zA-Z0-9_-]+)/,
      /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/,
      /instagram\.com\/([a-zA-Z0-9._]+)\/p\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of instagramPatterns) {
      const match = inputUrl.match(pattern);
      if (match) {
        const usernameMatch = inputUrl.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
        return {
          platform: "instagram",
          username: usernameMatch ? usernameMatch[1] : "instagram_user",
          postId: match[1] || match[2],
        };
      }
    }

    // TikTok patterns
    const tiktokPatterns = [
      /tiktok\.com\/@([a-zA-Z0-9._]+)\/video\/(\d+)/,
      /vm\.tiktok\.com\/([a-zA-Z0-9]+)/,
    ];

    for (const pattern of tiktokPatterns) {
      const match = inputUrl.match(pattern);
      if (match) {
        return {
          platform: "tiktok",
          username: match[1] || "tiktok_user",
          postId: match[2] || match[1],
        };
      }
    }

    // Facebook patterns
    const facebookPatterns = [
      /facebook\.com\/([a-zA-Z0-9.]+)\/posts\/(\d+)/,
      /facebook\.com\/photo\.php\?fbid=(\d+)/,
      /fb\.watch\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of facebookPatterns) {
      const match = inputUrl.match(pattern);
      if (match) {
        return {
          platform: "facebook",
          username: match[1] || "facebook_user",
          postId: match[2] || match[1],
        };
      }
    }

    // YouTube patterns
    const youtubePatterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      /youtu\.be\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of youtubePatterns) {
      const match = inputUrl.match(pattern);
      if (match) {
        return {
          platform: "youtube",
          username: "youtube_channel",
          postId: match[1],
        };
      }
    }

    return null;
  }, []);

  // Handle URL paste
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      validateUrl(text);
    } catch (error) {
      toast.error(t("newDraw.pasteError", "Unable to paste from clipboard"));
    }
  };

  // Validate URL and detect platform
  const validateUrl = async (inputUrl: string) => {
    if (!inputUrl.trim()) {
      setDetectedPlatform(null);
      return;
    }

    setIsValidating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const detected = detectPlatform(inputUrl);
    setDetectedPlatform(detected);
    setIsValidating(false);

    if (!detected) {
      toast.error(t("newDraw.invalidUrl", "URL not recognized. Please enter a valid social media post URL."));
    }
  };

  // Handle URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    if (newUrl.length > 10) {
      const timeoutId = setTimeout(() => validateUrl(newUrl), 500);
      return () => clearTimeout(timeoutId);
    } else {
      setDetectedPlatform(null);
    }
  };

  // Handle CSV file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast.error(t("newDraw.invalidFile", "Please select a valid CSV file"));
        return;
      }
      setCsvFile(file);
      setInputMode("csv");
      setUrl("");
      setDetectedPlatform(null);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setCsvFile(null);
    setInputMode("url");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Clear detection and go back to input
  const handleChangeUrl = () => {
    setDetectedPlatform(null);
    setUrl("");
    setIsImporting(false);
    setImportProgress({
      totalComments: 0,
      uniqueUsers: 0,
      scanProgress: 0,
      status: "fetching",
    });
    setAnimatedCount(0);
  };

  // Get platform icon component
  const getPlatformIcon = (platform: string) => {
    const iconClass = "w-6 h-6";
    switch (platform) {
      case "instagram":
        return <Instagram className={iconClass} />;
      case "tiktok":
        return <TikTokIcon className={iconClass} />;
      case "facebook":
        return <Facebook className={iconClass} />;
      case "youtube":
        return <YoutubeIcon className={iconClass} />;
      default:
        return <Link2 className={iconClass} />;
    }
  };

  // Get platform style
  const getPlatformStyle = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "bg-gradient-to-br from-[#f6339a] to-[#ff6900]";
      case "tiktok":
        return "bg-black";
      case "facebook":
        return "bg-[#1877F2]";
      case "youtube":
        return "bg-[#FF0000]";
      default:
        return "bg-accent-secondary";
    }
  };

  // Simulate import process
  const simulateImport = useCallback(async () => {
    const targetComments = Math.floor(Math.random() * 2000) + 500;
    const targetUsers = Math.floor(targetComments * 0.7);

    // Phase 1: Fetching (0-30%)
    setImportProgress({
      totalComments: 0,
      uniqueUsers: 0,
      scanProgress: 0,
      status: "fetching",
    });

    // Animate comment count
    const countDuration = 2000;
    const countSteps = 60;
    const countIncrement = targetComments / countSteps;

    for (let i = 0; i <= countSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, countDuration / countSteps));
      setAnimatedCount(Math.floor(countIncrement * i));
      setImportProgress((prev) => ({
        ...prev,
        scanProgress: Math.min(30, (i / countSteps) * 30),
      }));
    }

    setAnimatedCount(targetComments);
    setImportProgress((prev) => ({
      ...prev,
      totalComments: targetComments,
      scanProgress: 30,
      status: "scanning",
    }));

    // Phase 2: Scanning (30-100%)
    const scanSteps = 70;
    for (let i = 0; i <= scanSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30));
      const progress = 30 + (i / scanSteps) * 70;
      const currentUsers = Math.floor((i / scanSteps) * targetUsers);
      setImportProgress((prev) => ({
        ...prev,
        uniqueUsers: currentUsers,
        scanProgress: progress,
      }));
    }

    // Complete
    setImportProgress({
      totalComments: targetComments,
      uniqueUsers: targetUsers,
      scanProgress: 100,
      status: "complete",
    });
  }, []);

  // Handle import
  const handleImport = async () => {
    if (!termsAccepted) {
      toast.error(t("newDraw.acceptTerms", "Please accept the terms and conditions"));
      return;
    }

    if (!detectedPlatform && !csvFile) {
      toast.error(t("newDraw.noSource", "Please provide a URL or upload a CSV file"));
      return;
    }

    // Start import animation
    setIsImporting(true);
    await simulateImport();
  };

  // Generate mock participants based on import results
  const generateMockParticipants = useCallback((): Participant[] => {
    const count = Math.min(importProgress.uniqueUsers || 50, 100); // Limit to 100 for demo
    const platform = detectedPlatform?.platform || "manual";

    const firstNames = ["Emma", "Liam", "Olivia", "Noah", "Ava", "William", "Sophia", "James", "Isabella", "Oliver", "Mia", "Benjamin", "Charlotte", "Elijah", "Amelia", "Lucas", "Harper", "Mason", "Evelyn", "Logan"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

    const participants: Participant[] = [];
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const randomNum = Math.floor(Math.random() * 9999);

      participants.push({
        id: `participant-${i + 1}`,
        name: `${firstName} ${lastName}`,
        username: `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNum}`,
        platform: platform as "instagram" | "twitter" | "tiktok" | "manual",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}${randomNum}`,
        metadata: {
          importedAt: new Date().toISOString(),
          source: platform,
        },
      });
    }

    return participants;
  }, [importProgress.uniqueUsers, detectedPlatform]);

  // Handle continue to step 2
  const handleContinue = async () => {
    try {
      // Generate mock participants
      const participants = generateMockParticipants();

      // Create draw without participants first (backend may not accept them)
      const drawData = {
        title: detectedPlatform
          ? `${detectedPlatform.platform.charAt(0).toUpperCase() + detectedPlatform.platform.slice(1)} Giveaway`
          : "CSV Import Giveaway",
        platform: detectedPlatform?.platform || "manual",
        postUrl: detectedPlatform ? url : undefined,
        numberOfWinners: 1,
        status: "draft" as const,
      };

      const draw = await createDraw(drawData);

      // Store participants locally in the store
      setParticipants(participants);

      // Try to update the draw with participants (if backend supports it)
      try {
        await updateDraw(draw.id, { participants });
      } catch {
        // If update fails, participants are still in local store
        console.log("Participants stored locally only");
      }

      toast.success(t("newDraw.success", "Participants imported! Redirecting..."));
      navigate(`/draw/${draw.id}/filters`);
    } catch (error) {
      // Error handled by store
    }
  };

  const canImport = (detectedPlatform || csvFile) && termsAccepted;

  // Circular progress component
  const CircularProgress = ({ progress, size = 180, strokeWidth = 8 }: { progress: number; size?: number; strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(124, 58, 237, 0.2)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300 ease-out"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-bg-primary py-8 md:py-12">
      <div className="container-custom max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Step Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent-secondary/10 border border-accent-secondary/30 text-accent-secondary">
              <Sparkles className="w-4 h-4" />
              {t("newDraw.step", "Step")} 1 {t("newDraw.of", "of")} 3
            </span>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {t("newDraw.title", "Step 1: Import")}
            </h1>
            <p className="text-ink-secondary text-lg">
              {t("newDraw.subtitle", "Paste your social media post link below to fetch participants for your giveaway.")}
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-bg-card border border-white/[0.06] rounded-2xl p-6 md:p-8">
            {/* URL Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-ink-secondary mb-3">
                {t("newDraw.urlLabel", "Post URL")}
              </label>
              <div className="relative">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={handleUrlChange}
                      placeholder={t("newDraw.urlPlaceholder", "https://instagram.com/p/...")}
                      className="w-full pl-12 pr-4 py-4 bg-bg-elevated border border-white/10 rounded-xl text-white placeholder-ink-muted focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none transition-all"
                      disabled={inputMode === "csv" || isImporting}
                    />
                    {isValidating && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-5 h-5 text-accent-secondary animate-spin" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handlePaste}
                    disabled={inputMode === "csv" || isImporting}
                    className="px-6 py-4 bg-accent-secondary text-white font-medium rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("newDraw.paste", "PASTE")}
                  </button>
                </div>
              </div>
            </div>

            {/* Compatible Platforms - Show only when no platform detected */}
            {!detectedPlatform && !isImporting && (
              <div className="mb-6">
                <p className="text-sm text-ink-muted mb-3 uppercase tracking-wide">
                  {t("newDraw.compatible", "Compatible with:")}
                </p>
                <div className="flex flex-wrap gap-3">
                  {SUPPORTED_PLATFORMS.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <div
                        key={platform.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-bg-elevated rounded-full border border-white/[0.06]"
                      >
                        <Icon className="w-4 h-4 text-white" />
                        <span className="text-sm text-ink-secondary">{platform.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Detected Platform Info */}
            <AnimatePresence>
              {detectedPlatform && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-bg-elevated border border-accent-secondary/30 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${getPlatformStyle(detectedPlatform.platform)} flex items-center justify-center text-white`}>
                      {getPlatformIcon(detectedPlatform.platform)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {detectedPlatform.platform.charAt(0).toUpperCase() + detectedPlatform.platform.slice(1)} Post {t("newDraw.detected", "detected")}
                      </p>
                      <p className="text-ink-secondary text-sm">
                        {t("newDraw.account", "Account:")} @{detectedPlatform.username}
                      </p>
                    </div>
                    {!isImporting && (
                      <button
                        onClick={handleChangeUrl}
                        className="text-accent-secondary hover:text-accent-tertiary text-sm font-medium flex items-center gap-1 transition-colors"
                      >
                        {t("newDraw.change", "Change")}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Import Animation Section */}
            <AnimatePresence>
              {isImporting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  {/* Circular Progress */}
                  <div className="flex flex-col items-center py-8">
                    <div className="relative">
                      <CircularProgress
                        progress={importProgress.status === "complete" ? 100 : Math.min(importProgress.scanProgress, 99)}
                        size={180}
                        strokeWidth={8}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          key={animatedCount}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-5xl font-bold text-white"
                        >
                          {animatedCount.toLocaleString()}
                        </motion.span>
                        <span className="text-sm text-accent-secondary font-medium uppercase tracking-wider">
                          {t("newDraw.comments", "Comments")}
                        </span>
                      </div>
                    </div>

                    {/* Status Text */}
                    <div className="mt-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-ink-secondary mb-2">
                        {importProgress.status !== "complete" && (
                          <Sparkles className="w-4 h-4 text-accent-secondary animate-pulse" />
                        )}
                        <span>
                          {importProgress.status === "fetching" && t("newDraw.fetching", "Fetching participants...")}
                          {importProgress.status === "scanning" && t("newDraw.scanning", "Scanning comments...")}
                          {importProgress.status === "complete" && t("newDraw.complete", "Import complete!")}
                        </span>
                      </div>
                      {importProgress.uniqueUsers > 0 && (
                        <p className="text-sm text-ink-muted">
                          {t("newDraw.found", "Found")} {importProgress.totalComments.toLocaleString()} {t("newDraw.commentsFrom", "comments from")} {importProgress.uniqueUsers.toLocaleString()} {t("newDraw.uniqueUsers", "unique users")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Scanning Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-ink-muted uppercase tracking-wide">
                        {t("newDraw.scanningLabel", "Scanning")}
                      </span>
                      <span className="text-sm font-medium text-accent-secondary">
                        {Math.round(importProgress.scanProgress)}%
                      </span>
                    </div>
                    <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent-secondary to-accent-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${importProgress.scanProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={importProgress.status !== "complete" || isLoading}
                    className={`w-full py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition-all ${
                      importProgress.status === "complete"
                        ? "bg-accent-primary text-white hover:brightness-110"
                        : "bg-bg-elevated text-ink-muted cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t("newDraw.creating", "Creating draw...")}
                      </>
                    ) : (
                      <>
                        {t("newDraw.continueStep2", "Continue to Step 2")}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CSV Upload Section - Only show when not importing */}
            {!isImporting && !detectedPlatform && (
              <>
                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.06]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-bg-card text-ink-muted">
                      {t("newDraw.or", "OR")}
                    </span>
                  </div>
                </div>

                {/* CSV Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-ink-secondary mb-3">
                    {t("newDraw.csvLabel", "Upload CSV File")}
                  </label>

                  {csvFile ? (
                    <div className="flex items-center gap-4 p-4 bg-bg-elevated border border-accent-secondary/30 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-accent-secondary/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-accent-secondary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{csvFile.name}</p>
                        <p className="text-ink-secondary text-sm">
                          {(csvFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 text-ink-muted hover:text-error transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-6 border-2 border-dashed border-white/10 rounded-xl hover:border-accent-secondary/50 transition-colors group"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-bg-elevated flex items-center justify-center group-hover:bg-accent-secondary/10 transition-colors">
                          <Upload className="w-6 h-6 text-ink-muted group-hover:text-accent-secondary transition-colors" />
                        </div>
                        <div className="text-center">
                          <p className="text-ink-secondary group-hover:text-white transition-colors">
                            {t("newDraw.dropCsv", "Click to upload or drag and drop")}
                          </p>
                          <p className="text-ink-muted text-sm">
                            CSV {t("newDraw.fileFormat", "file only")}
                          </p>
                        </div>
                      </div>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </>
            )}

            {/* Terms Checkbox - Always visible */}
            <div className={isImporting ? "mt-6" : "mb-8"}>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="sr-only"
                    disabled={isImporting}
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                    termsAccepted
                      ? "bg-accent-secondary border-accent-secondary"
                      : "border-white/20 group-hover:border-white/40"
                  } ${isImporting ? "opacity-50" : ""}`}>
                    {termsAccepted && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <span className="text-sm text-ink-secondary">
                  {t("newDraw.termsAgree", "By continuing, you agree to our")}{" "}
                  <a href="/terms" className="text-accent-secondary hover:text-accent-tertiary underline">
                    {t("newDraw.termsOfService", "Terms of Service")}
                  </a>{" "}
                  {t("newDraw.regarding", "regarding data scraping and platform policies.")}
                </span>
              </label>
            </div>

            {/* Import Button - Only show when not importing */}
            {!isImporting && (
              <button
                type="button"
                onClick={handleImport}
                disabled={!canImport || isLoading}
                className={`w-full py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition-all ${
                  canImport
                    ? "bg-accent-primary text-white hover:brightness-110"
                    : "bg-bg-elevated text-ink-muted cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t("newDraw.importing", "Importing...")}
                  </>
                ) : (
                  <>
                    {t("newDraw.importButton", "Import Participants")}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-ink-secondary hover:text-white transition-colors"
            >
              {t("newDraw.back", "← Back to Dashboard")}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
