import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Filter,
  Sparkles,
  Users,
  AlertCircle,
  X,
  Plus,
  Settings,
} from "lucide-react";
import { useDrawStore } from "../store/useDrawStore";
import toast from "react-hot-toast";

interface FilterSection {
  id: string;
  isOpen: boolean;
}

interface FiltersState {
  removeDuplicates: boolean;
  maxEntriesPerUser: number;
  minMentions: number;
  requiredKeywords: string;
  requiredHashtags: string;
  verifyFollowers: boolean;
  excludedUsers: string[];
}

export default function DrawFiltersPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentDraw, fetchDraw, updateDraw, participants: storeParticipants, isLoading } = useDrawStore();

  // Section collapse state
  const [sections, setSections] = useState<FilterSection[]>([
    { id: "basic", isOpen: true },
    { id: "advanced", isOpen: true },
    { id: "follower", isOpen: true },
    { id: "exclude", isOpen: true },
  ]);

  // Filters state
  const [filters, setFilters] = useState<FiltersState>({
    removeDuplicates: true,
    maxEntriesPerUser: 2,
    minMentions: 0,
    requiredKeywords: "",
    requiredHashtags: "",
    verifyFollowers: false,
    excludedUsers: [],
  });

  // Exclude user input
  const [excludeInput, setExcludeInput] = useState("");

  // Load draw data
  useEffect(() => {
    if (id) {
      fetchDraw(id);
    }
  }, [id, fetchDraw]);

  // Initialize filters from current draw
  useEffect(() => {
    if (currentDraw?.filters) {
      setFilters({
        removeDuplicates: currentDraw.filters.removeDuplicates ?? true,
        maxEntriesPerUser: currentDraw.filters.maxEntriesPerUser ?? 2,
        minMentions: currentDraw.filters.minMentions ?? 0,
        requiredKeywords: currentDraw.filters.requiredKeywords?.join(", ") ?? "",
        requiredHashtags: currentDraw.filters.requiredHashtags?.join(", ") ?? "",
        verifyFollowers: currentDraw.filters.verifyFollowers ?? false,
        excludedUsers: currentDraw.filters.excludedUsers ?? [],
      });
    }
  }, [currentDraw]);

  // Calculate real-time analysis
  const analysis = useMemo(() => {
    // Use participants from store if currentDraw doesn't have them
    const totalParticipants = currentDraw?.participants?.length || storeParticipants?.length || 0;

    // Simulate filter calculations
    let filteredOut = 0;

    if (filters.removeDuplicates) {
      filteredOut += Math.floor(totalParticipants * 0.15); // ~15% duplicates
    }

    if (filters.maxEntriesPerUser > 0 && filters.maxEntriesPerUser < 5) {
      filteredOut += Math.floor(totalParticipants * 0.1 * (5 - filters.maxEntriesPerUser));
    }

    if (filters.minMentions > 0) {
      filteredOut += Math.floor(totalParticipants * 0.05 * filters.minMentions);
    }

    if (filters.requiredKeywords) {
      const keywordCount = filters.requiredKeywords.split(",").filter(k => k.trim()).length;
      filteredOut += Math.floor(totalParticipants * 0.1 * keywordCount);
    }

    if (filters.requiredHashtags) {
      const hashtagCount = filters.requiredHashtags.split(",").filter(h => h.trim()).length;
      filteredOut += Math.floor(totalParticipants * 0.08 * hashtagCount);
    }

    filteredOut += filters.excludedUsers.length;

    // Cap filtered out at reasonable amount
    filteredOut = Math.min(filteredOut, Math.floor(totalParticipants * 0.7));

    const qualified = Math.max(0, totalParticipants - filteredOut);
    const progressPercent = totalParticipants > 0
      ? Math.round((qualified / totalParticipants) * 100)
      : 0;

    let successLevel: "High" | "Medium" | "Low" = "High";
    if (progressPercent < 30) successLevel = "Low";
    else if (progressPercent < 60) successLevel = "Medium";

    return {
      totalParticipants,
      filteredOut,
      qualified,
      progressPercent,
      successLevel,
    };
  }, [currentDraw, storeParticipants, filters]);

  // Toggle section
  const toggleSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(s => (s.id === sectionId ? { ...s, isOpen: !s.isOpen } : s))
    );
  };

  // Check if section is open
  const isSectionOpen = (sectionId: string) => {
    return sections.find(s => s.id === sectionId)?.isOpen ?? true;
  };

  // Add excluded user
  const handleAddExcludedUser = () => {
    const username = excludeInput.trim().replace("@", "");
    if (username && !filters.excludedUsers.includes(username)) {
      setFilters(prev => ({
        ...prev,
        excludedUsers: [...prev.excludedUsers, username],
      }));
      setExcludeInput("");
    }
  };

  // Remove excluded user
  const handleRemoveExcludedUser = (username: string) => {
    setFilters(prev => ({
      ...prev,
      excludedUsers: prev.excludedUsers.filter(u => u !== username),
    }));
  };

  // Handle run the draw
  const handleRunDraw = async () => {
    if (!id) return;

    try {
      // Save filters
      await updateDraw(id, {
        filters: {
          removeDuplicates: filters.removeDuplicates,
          maxEntriesPerUser: filters.maxEntriesPerUser,
          minMentions: filters.minMentions,
          requiredKeywords: filters.requiredKeywords
            .split(",")
            .map(k => k.trim())
            .filter(Boolean),
          requiredHashtags: filters.requiredHashtags
            .split(",")
            .map(h => h.trim())
            .filter(Boolean),
          verifyFollowers: filters.verifyFollowers,
          excludedUsers: filters.excludedUsers,
        },
        status: "configured",
      });

      toast.success(t("filters.saved", "Filters saved!"));
      navigate(`/draw/${id}/execute`);
    } catch (error) {
      // Error handled by store
    }
  };

  // Circular progress component
  const CircularProgress = ({ progress, size = 120, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(124, 58, 237, 0.2)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#filterProgressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
        <defs>
          <linearGradient id="filterProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  if (isLoading && !currentDraw) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-accent-secondary border-t-transparent mb-4"></div>
          <p className="text-ink-secondary">{t("filters.loading", "Loading draw...")}</p>
        </div>
      </div>
    );
  }

  if (!currentDraw) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-secondary">{t("filters.notFound", "Draw not found")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary py-8">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-ink-secondary hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {t("filters.back", "Back")}
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-accent-secondary uppercase tracking-wide">
                {t("filters.stepLabel", "Step 2 of 3")}
              </span>
              <button className="p-2 text-ink-muted hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title with progress bar */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("filters.title", "Configure Filters")}
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-accent-secondary to-accent-primary rounded-full" />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Filters */}
            <div className="lg:col-span-2 space-y-4">
              {/* Basic Filters */}
              <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection("basic")}
                  className="w-full flex items-center justify-between p-5 hover:bg-bg-elevated transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-accent-secondary" />
                    <span className="font-semibold text-white">
                      {t("filters.basic.title", "Basic Filters")}
                    </span>
                  </div>
                  {isSectionOpen("basic") ? (
                    <ChevronUp className="w-5 h-5 text-ink-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-ink-muted" />
                  )}
                </button>

                <AnimatePresence>
                  {isSectionOpen("basic") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-6">
                        {/* Remove duplicates toggle */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-white">
                              {t("filters.basic.removeDuplicates", "Remove duplicate entries")}
                            </p>
                            <p className="text-sm text-ink-muted mt-1">
                              {t("filters.basic.removeDuplicatesDesc", "Only count one entry per unique user profile even if they commented multiple times.")}
                            </p>
                          </div>
                          <button
                            onClick={() => setFilters(prev => ({ ...prev, removeDuplicates: !prev.removeDuplicates }))}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              filters.removeDuplicates ? "bg-accent-secondary" : "bg-bg-elevated"
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                filters.removeDuplicates ? "translate-x-7" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Max entries per user */}
                        <div>
                          <p className="font-medium text-white mb-1">
                            {t("filters.basic.maxEntries", "Maximum entries per user")}
                          </p>
                          <p className="text-sm text-ink-muted mb-3">
                            {t("filters.basic.maxEntriesDesc", "Set a limit on how many chances a single user can have.")}
                          </p>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={filters.maxEntriesPerUser}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxEntriesPerUser: parseInt(e.target.value) || 1 }))}
                            className="w-24 px-4 py-3 bg-bg-elevated border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Advanced Filters */}
              <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection("advanced")}
                  className="w-full flex items-center justify-between p-5 hover:bg-bg-elevated transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-accent-secondary" />
                    <span className="font-semibold text-white">
                      {t("filters.advanced.title", "Advanced Filters")}
                    </span>
                  </div>
                  {isSectionOpen("advanced") ? (
                    <ChevronUp className="w-5 h-5 text-ink-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-ink-muted" />
                  )}
                </button>

                <AnimatePresence>
                  {isSectionOpen("advanced") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Min mentions */}
                          <div>
                            <p className="font-medium text-white mb-2">
                              {t("filters.advanced.minMentions", "Min @ mentions")}
                            </p>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={filters.minMentions}
                              onChange={(e) => setFilters(prev => ({ ...prev, minMentions: parseInt(e.target.value) || 0 }))}
                              className="w-full px-4 py-3 bg-bg-elevated border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none"
                            />
                          </div>

                          {/* Required keywords */}
                          <div>
                            <p className="font-medium text-white mb-2">
                              {t("filters.advanced.requiredKeywords", "Required keywords")}
                            </p>
                            <input
                              type="text"
                              value={filters.requiredKeywords}
                              onChange={(e) => setFilters(prev => ({ ...prev, requiredKeywords: e.target.value }))}
                              placeholder="#cleackgiveaway, #contest"
                              className="w-full px-4 py-3 bg-bg-elevated border border-white/10 rounded-lg text-white placeholder-ink-muted focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none"
                            />
                          </div>
                        </div>

                        {/* Required hashtags */}
                        <div>
                          <p className="font-medium text-white mb-2">
                            {t("filters.advanced.requiredHashtags", "Required #hashtags")}
                          </p>
                          <input
                            type="text"
                            value={filters.requiredHashtags}
                            onChange={(e) => setFilters(prev => ({ ...prev, requiredHashtags: e.target.value }))}
                            placeholder="#cleackgiveaway, #contest"
                            className="w-full px-4 py-3 bg-bg-elevated border border-white/10 rounded-lg text-white placeholder-ink-muted focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Follower Verification */}
              <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection("follower")}
                  className="w-full flex items-center justify-between p-5 hover:bg-bg-elevated transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-accent-secondary" />
                    <span className="font-semibold text-white">
                      {t("filters.follower.title", "Follower Verification")}
                    </span>
                  </div>
                  {isSectionOpen("follower") ? (
                    <ChevronUp className="w-5 h-5 text-ink-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-ink-muted" />
                  )}
                </button>

                <AnimatePresence>
                  {isSectionOpen("follower") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4">
                        <div>
                          <p className="font-medium text-white">
                            {t("filters.follower.verify", "Verify if participants follow you")}
                          </p>
                          <p className="text-sm text-ink-muted mt-1">
                            {t("filters.follower.verifyDesc", "Automatically exclude users who are not following @cleack_app.")}
                          </p>
                        </div>

                        {/* Premium warning */}
                        <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/30 rounded-xl">
                          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
                          <p className="text-sm text-warning">
                            {t("filters.follower.premiumWarning", "Requires Instagram API Premium access. Verification takes longer.")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Exclude Participants */}
              <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection("exclude")}
                  className="w-full flex items-center justify-between p-5 hover:bg-bg-elevated transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <X className="w-5 h-5 text-accent-secondary" />
                    <span className="font-semibold text-white">
                      {t("filters.exclude.title", "Exclude Participants")}
                    </span>
                  </div>
                  {isSectionOpen("exclude") ? (
                    <ChevronUp className="w-5 h-5 text-ink-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-ink-muted" />
                  )}
                </button>

                <AnimatePresence>
                  {isSectionOpen("exclude") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4">
                        <p className="text-sm text-ink-muted">
                          {t("filters.exclude.description", "Add specific usernames to ignore them in this draw (e.g., your own account or previous winners).")}
                        </p>

                        {/* Excluded users tags */}
                        {filters.excludedUsers.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {filters.excludedUsers.map((user) => (
                              <span
                                key={user}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-elevated rounded-full text-sm"
                              >
                                <span className="text-ink-secondary">@{user}</span>
                                <button
                                  onClick={() => handleRemoveExcludedUser(user)}
                                  className="text-ink-muted hover:text-error transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Add user input */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={excludeInput}
                            onChange={(e) => setExcludeInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleAddExcludedUser()}
                            placeholder={t("filters.exclude.placeholder", "Type username...")}
                            className="flex-1 px-4 py-3 bg-bg-elevated border border-white/10 rounded-lg text-white placeholder-ink-muted focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none"
                          />
                          <button
                            onClick={handleAddExcludedUser}
                            disabled={!excludeInput.trim()}
                            className="px-6 py-3 bg-accent-secondary text-white font-medium rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {t("filters.exclude.add", "Add")}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column - Real-time Analysis */}
            <div className="lg:col-span-1">
              <div className="bg-bg-card border border-white/[0.06] rounded-xl p-6 sticky top-24">
                {/* Progress circle */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <CircularProgress progress={analysis.progressPercent} size={120} strokeWidth={6} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-ink-secondary">
                        {analysis.progressPercent}% {t("filters.analysis.complete", "Complete")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <p className="text-center text-sm text-ink-muted uppercase tracking-wide mb-6">
                  {t("filters.analysis.title", "Real-time Analysis")}
                </p>

                {/* Qualified count */}
                <div className="text-center mb-6">
                  <motion.p
                    key={analysis.qualified}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-bold text-white"
                  >
                    {analysis.qualified.toLocaleString()}
                  </motion.p>
                  <p className="text-sm text-accent-secondary font-medium uppercase tracking-wider">
                    {t("filters.analysis.qualified", "Qualified")}
                  </p>
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-secondary">
                      {t("filters.analysis.totalParticipants", "Total Participants")}
                    </span>
                    <span className="font-medium text-white">
                      {analysis.totalParticipants.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-secondary">
                      {t("filters.analysis.filteredOut", "Filtered Out")}
                    </span>
                    <span className="font-medium text-accent-primary">
                      -{analysis.filteredOut.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-secondary">
                      {t("filters.analysis.estimatedSuccess", "Estimated Success")}
                    </span>
                    <span className={`font-medium ${
                      analysis.successLevel === "High" ? "text-success" :
                      analysis.successLevel === "Medium" ? "text-warning" : "text-error"
                    }`}>
                      {t(`filters.analysis.success${analysis.successLevel}`, analysis.successLevel)}
                    </span>
                  </div>
                </div>

                {/* Run the Draw button */}
                <button
                  onClick={handleRunDraw}
                  disabled={isLoading || analysis.qualified === 0}
                  className="w-full py-4 bg-accent-primary text-white font-medium rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {t("filters.runDraw", "Run the Draw")}
                </button>

                {/* Disclaimer */}
                <p className="text-xs text-ink-muted text-center mt-4">
                  {t("filters.disclaimer", "By clicking \"Run the Draw\", you confirm that these filters comply with your giveaway terms.")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
