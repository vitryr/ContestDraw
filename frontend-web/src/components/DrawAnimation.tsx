import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Participant, Winner } from "../types";

interface DrawAnimationProps {
  participants: Participant[];
  winners: Winner[];
  drawTitle: string;
  onComplete?: () => void;
}

// Sparkle component for decorations
const SparkleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
  </svg>
);

export default function DrawAnimation({
  participants,
  winners,
  drawTitle,
  onComplete,
}: DrawAnimationProps) {
  const { t } = useTranslation();
  const [currentPhase, setCurrentPhase] = useState<"shuffling" | "winner">("shuffling");
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [shuffleIndex, setShuffleIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(true);

  // Create shuffled participants for animation
  const shuffledParticipants = useMemo(() => {
    if (!participants.length) return [];
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    return shuffled;
  }, [participants]);

  // Shuffling animation
  useEffect(() => {
    if (currentPhase !== "shuffling" || !isShuffling) return;

    const shuffleInterval = setInterval(() => {
      setShuffleIndex((prev) => (prev + 1) % Math.max(shuffledParticipants.length, 1));
    }, 80); // Fast shuffle speed

    // Stop shuffling and reveal winner after 3.5 seconds
    const stopTimer = setTimeout(() => {
      setIsShuffling(false);
      clearInterval(shuffleInterval);

      // Brief pause before winner reveal
      setTimeout(() => {
        setCurrentPhase("winner");
        fireConfetti();
      }, 500);
    }, 3500);

    return () => {
      clearInterval(shuffleInterval);
      clearTimeout(stopTimer);
    };
  }, [currentPhase, isShuffling, shuffledParticipants.length]);

  // Handle multiple winners
  useEffect(() => {
    if (currentPhase === "winner" && winners.length > 1) {
      if (currentWinnerIndex < winners.length - 1) {
        const winnerTimer = setTimeout(() => {
          setCurrentWinnerIndex((prev) => prev + 1);
          fireConfetti();
        }, 4000);

        return () => clearTimeout(winnerTimer);
      } else if (onComplete) {
        const completeTimer = setTimeout(onComplete, 4000);
        return () => clearTimeout(completeTimer);
      }
    } else if (currentPhase === "winner" && winners.length === 1 && onComplete) {
      const completeTimer = setTimeout(onComplete, 4000);
      return () => clearTimeout(completeTimer);
    }
  }, [currentPhase, currentWinnerIndex, winners.length, onComplete]);

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 100,
      colors: ["#ec4899", "#7c3aed", "#a855f7", "#ffffff", "#ffd700"],
    };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const currentShuffleParticipant = shuffledParticipants[shuffleIndex] || participants[0];
  const currentWinner = winners[currentWinnerIndex];

  return (
    <div className="fixed inset-0 bg-bg-primary flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0, -100, 0],
            y: [0, -50, 100, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/30 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, -100, 0, 100, 0],
            y: [0, 50, -100, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-accent-secondary/30 rounded-full blur-[150px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {/* Shuffling Phase */}
          {currentPhase === "shuffling" && (
            <motion.div
              key="shuffling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {/* Title */}
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-2xl text-ink-secondary mb-12"
              >
                {t("draw.shuffling", "Mélange des participants...")}
              </motion.p>

              {/* Shuffling Avatar Card */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                  className="flex flex-col items-center"
                >
                  {/* Avatar */}
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-full bg-bg-elevated border-2 border-accent-secondary/50 overflow-hidden">
                      {currentShuffleParticipant?.avatar ? (
                        <img
                          src={currentShuffleParticipant.avatar}
                          alt=""
                          className="w-full h-full object-cover opacity-70"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-ink-muted">
                          {currentShuffleParticipant?.name?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <motion.h2
                    key={shuffleIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.7, y: 0 }}
                    className="text-3xl font-bold text-white/70 mb-2"
                  >
                    {currentShuffleParticipant?.name || "..."}
                  </motion.h2>

                  {/* Username */}
                  <motion.p
                    key={`username-${shuffleIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    className="text-lg text-ink-muted"
                  >
                    @{currentShuffleParticipant?.username || "..."}
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Winner Reveal Phase */}
          {currentPhase === "winner" && currentWinner && (
            <motion.div
              key={`winner-${currentWinnerIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center"
            >
              {/* Winner Title */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-3 mb-8"
              >
                <Trophy className="w-8 h-8 text-accent-primary" />
                <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                  {winners.length > 1
                    ? t("draw.winnerNumber", "Gagnant #{{number}} sélectionné !", { number: currentWinnerIndex + 1 })
                    : t("draw.winnerSelected", "Gagnant sélectionné !")}
                </h1>
                <Trophy className="w-8 h-8 text-accent-primary" />
              </motion.div>

              {/* Winner Card */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                {/* Glowing border card */}
                <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary">
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary blur-lg opacity-50" />

                  {/* Card content */}
                  <div className="relative bg-bg-card rounded-2xl p-8 md:p-12">
                    {/* Sparkle decorations */}
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute top-6 left-6"
                    >
                      <SparkleIcon className="w-5 h-5 text-accent-secondary/60" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute top-6 right-6"
                    >
                      <SparkleIcon className="w-6 h-6 text-accent-primary/60" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 3.5, repeat: Infinity }}
                      className="absolute bottom-6 left-6"
                    >
                      <SparkleIcon className="w-4 h-4 text-accent-primary/50" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: -360, scale: [1, 1.4, 1] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="absolute bottom-6 right-6"
                    >
                      <SparkleIcon className="w-5 h-5 text-accent-secondary/50" />
                    </motion.div>

                    {/* Winner Avatar */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                      className="relative w-32 h-32 mx-auto mb-6"
                    >
                      {/* Purple ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-secondary to-accent-tertiary p-1">
                        <div className="w-full h-full rounded-full bg-bg-card overflow-hidden">
                          {currentWinner.participant.avatar ? (
                            <img
                              src={currentWinner.participant.avatar}
                              alt={currentWinner.participant.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl text-white bg-bg-elevated">
                              {currentWinner.participant.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Trophy badge */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.9, type: "spring" }}
                        className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center shadow-lg"
                      >
                        <Trophy className="w-5 h-5 text-white" />
                      </motion.div>
                    </motion.div>

                    {/* Winner Name */}
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-3xl md:text-4xl font-bold text-gradient mb-2"
                    >
                      {currentWinner.participant.name}
                    </motion.h2>

                    {/* Username */}
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-lg text-ink-secondary"
                    >
                      @{currentWinner.participant.username}
                    </motion.p>
                  </div>
                </div>
              </motion.div>

              {/* Next winner indicator */}
              {winners.length > 1 && currentWinnerIndex < winners.length - 1 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="mt-8 text-ink-muted text-sm"
                >
                  {t("draw.nextWinner", "Prochain gagnant dans 3 secondes...")}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
