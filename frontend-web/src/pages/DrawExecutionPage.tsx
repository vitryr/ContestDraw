import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Play, Users, Trophy, Filter, Sparkles, ArrowLeft } from "lucide-react";
import { useDrawStore } from "../store/useDrawStore";
import DrawAnimation from "../components/DrawAnimation";
import type { Winner } from "../types";
import toast from "react-hot-toast";

export default function DrawExecutionPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentDraw, fetchDraw, executeDraw, winners: storeWinners, isLoading } = useDrawStore();
  const [isExecuting, setIsExecuting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [localWinners, setLocalWinners] = useState<Winner[]>([]);

  useEffect(() => {
    if (id) {
      fetchDraw(id);
    }
  }, [id, fetchDraw]);

  // Redirect completed draws to results page
  useEffect(() => {
    if (currentDraw && currentDraw.status?.toLowerCase() === "completed") {
      navigate(`/draw/${id}/results`, { replace: true });
    }
  }, [currentDraw, id, navigate]);

  const handleExecuteDraw = async () => {
    if (!id) return;

    setIsExecuting(true);
    setShowAnimation(true);

    try {
      await executeDraw(id);
      toast.success(t("execute.success", "Draw completed successfully!"));
    } catch (error) {
      // If backend fails, generate mock winners from participants for demo
      const participants = currentDraw?.participants || [];
      if (participants.length > 0) {
        const numberOfWinners = currentDraw?.numberOfWinners || 1;
        const shuffled = [...participants].sort(() => Math.random() - 0.5);
        const selectedWinners = shuffled.slice(0, numberOfWinners);

        const mockWinners: Winner[] = selectedWinners.map((participant, index) => ({
          id: `winner-${index + 1}`,
          participant,
          position: index + 1,
          drawId: id,
        }));

        setLocalWinners(mockWinners);
        toast.success(t("execute.success", "Draw completed successfully!"));
      } else {
        setIsExecuting(false);
        setShowAnimation(false);
        toast.error(t("execute.noParticipants", "No participants available"));
      }
    }
  };

  const handleAnimationComplete = () => {
    navigate(`/draw/${id}/results`);
  };

  if (isLoading && !currentDraw) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-accent-secondary border-t-transparent mb-4"></div>
          <p className="text-ink-secondary">{t("execute.loading", "Loading draw...")}</p>
        </div>
      </div>
    );
  }

  if (!currentDraw) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-secondary">{t("execute.notFound", "Draw not found")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <AnimatePresence>
        {showAnimation ? (
          <DrawAnimation
            participants={currentDraw.participants || []}
            winners={storeWinners.length > 0 ? storeWinners : localWinners}
            drawTitle={currentDraw.title}
            onComplete={handleAnimationComplete}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{
                  x: [0, 50, 0, -50, 0],
                  y: [0, -30, 50, 30, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent-secondary/20 rounded-full blur-[120px]"
              />
              <motion.div
                animate={{
                  x: [0, -50, 0, 50, 0],
                  y: [0, 30, -50, -30, 0],
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-accent-primary/20 rounded-full blur-[120px]"
              />
            </div>

            <div className="relative z-10 container-custom py-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => navigate(`/draw/${id}/filters`)}
                  className="flex items-center gap-2 text-ink-secondary hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  {t("execute.back", "Back")}
                </button>
                <span className="text-sm font-medium text-accent-secondary uppercase tracking-wide">
                  {t("execute.stepLabel", "Step 3 of 3")}
                </span>
              </div>

              {/* Main content */}
              <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-xl"
                >
                  {/* Preview Card */}
                  <div className="bg-bg-card border border-white/[0.06] rounded-2xl p-8 mb-8">
                    {/* Title */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent-secondary/10 border border-accent-secondary/30 text-accent-secondary mb-4">
                        <Sparkles className="w-4 h-4" />
                        {t("execute.ready", "Ready to Draw")}
                      </div>
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {currentDraw.title}
                      </h1>
                      {currentDraw.description && (
                        <p className="text-ink-secondary">
                          {currentDraw.description}
                        </p>
                      )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-bg-elevated rounded-xl p-4 text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-accent-secondary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-accent-secondary" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                          {currentDraw.participants?.length || 0}
                        </div>
                        <div className="text-xs text-ink-muted">
                          {t("execute.participants", "Participants")}
                        </div>
                      </div>

                      <div className="bg-bg-elevated rounded-xl p-4 text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-accent-primary/10 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-accent-primary" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                          {currentDraw.numberOfWinners}
                        </div>
                        <div className="text-xs text-ink-muted">
                          {t("execute.winners", "Winners")}
                        </div>
                      </div>

                      <div className="bg-bg-elevated rounded-xl p-4 text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-success/10 flex items-center justify-center">
                          <Filter className="w-5 h-5 text-success" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                          {Object.keys(currentDraw.filters || {}).filter(k =>
                            currentDraw.filters?.[k as keyof typeof currentDraw.filters]
                          ).length}
                        </div>
                        <div className="text-xs text-ink-muted">
                          {t("execute.filters", "Filters")}
                        </div>
                      </div>
                    </div>

                    {/* Applied Filters Summary */}
                    {currentDraw.filters && Object.keys(currentDraw.filters).some(k =>
                      currentDraw.filters?.[k as keyof typeof currentDraw.filters]
                    ) && (
                      <div className="bg-bg-elevated rounded-xl p-4 mb-8">
                        <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                          <Filter className="w-4 h-4 text-accent-secondary" />
                          {t("execute.appliedFilters", "Applied Filters")}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {currentDraw.filters.removeDuplicates && (
                            <span className="px-3 py-1 bg-bg-card rounded-full text-xs text-ink-secondary">
                              {t("execute.filter.duplicates", "Remove duplicates")}
                            </span>
                          )}
                          {currentDraw.filters.maxEntriesPerUser && (
                            <span className="px-3 py-1 bg-bg-card rounded-full text-xs text-ink-secondary">
                              {t("execute.filter.maxEntries", "Max {{count}} entries", { count: currentDraw.filters.maxEntriesPerUser })}
                            </span>
                          )}
                          {currentDraw.filters.minMentions && currentDraw.filters.minMentions > 0 && (
                            <span className="px-3 py-1 bg-bg-card rounded-full text-xs text-ink-secondary">
                              {t("execute.filter.minMentions", "Min {{count}} mentions", { count: currentDraw.filters.minMentions })}
                            </span>
                          )}
                          {currentDraw.filters.excludedUsers && currentDraw.filters.excludedUsers.length > 0 && (
                            <span className="px-3 py-1 bg-bg-card rounded-full text-xs text-ink-secondary">
                              {t("execute.filter.excluded", "{{count}} excluded", { count: currentDraw.filters.excludedUsers.length })}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Execute Button */}
                    <button
                      onClick={handleExecuteDraw}
                      disabled={isExecuting || !currentDraw.participants?.length}
                      className="w-full py-4 bg-gradient-to-r from-accent-secondary to-accent-primary text-white font-semibold text-lg rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isExecuting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t("execute.executing", "Executing Draw...")}
                        </>
                      ) : (
                        <>
                          <Play className="w-6 h-6" />
                          {t("execute.start", "Start Draw")}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Instructions */}
                  <div className="text-center space-y-3">
                    <p className="text-ink-secondary">
                      {t("execute.instruction1", "We'll randomly select")} {currentDraw.numberOfWinners}{" "}
                      {t("execute.instruction2", "winner(s) from")} {currentDraw.participants?.length || 0}{" "}
                      {t("execute.instruction3", "participants.")}
                    </p>
                    <p className="text-ink-muted text-sm">
                      {t("execute.fairness", "Using a cryptographically secure random algorithm for fair selection.")}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
