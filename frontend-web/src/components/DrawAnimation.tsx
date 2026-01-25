import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles } from 'lucide-react';
import type { Participant, Winner } from '../types';

interface DrawAnimationProps {
  participants: Participant[];
  winners: Winner[];
  drawTitle: string;
}

export default function DrawAnimation({ participants, winners, drawTitle }: DrawAnimationProps) {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'scrolling' | 'winner'>('intro');
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [scrollingNames, setScrollingNames] = useState<string[]>([]);

  useEffect(() => {
    // Phase 1: Intro (2s)
    const introTimer = setTimeout(() => {
      setCurrentPhase('scrolling');
      // Create scrolling names list
      const names = participants.map((p) => p.name);
      const repeatedNames = Array(10).fill(names).flat();
      setScrollingNames(repeatedNames);
    }, 2000);

    return () => clearTimeout(introTimer);
  }, [participants]);

  useEffect(() => {
    if (currentPhase === 'scrolling') {
      // Phase 2: Scrolling (3s)
      const scrollTimer = setTimeout(() => {
        setCurrentPhase('winner');
        // Fire confetti
        fireConfetti();
      }, 3000);

      return () => clearTimeout(scrollTimer);
    }
  }, [currentPhase]);

  useEffect(() => {
    if (currentPhase === 'winner' && winners.length > 1) {
      // Cycle through winners if multiple
      if (currentWinnerIndex < winners.length - 1) {
        const winnerTimer = setTimeout(() => {
          setCurrentWinnerIndex(currentWinnerIndex + 1);
          fireConfetti();
        }, 3000);

        return () => clearTimeout(winnerTimer);
      }
    }
  }, [currentPhase, currentWinnerIndex, winners]);

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

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

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-600 via-accent-600 to-primary-900 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Story Format Container (9:16 aspect ratio) */}
        <div className="aspect-[9/16] bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden relative">
          <AnimatePresence mode="wait">
            {/* Phase 1: Intro */}
            {currentPhase === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-8"
                >
                  <Trophy className="w-24 h-24 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold text-white mb-4">{drawTitle}</h1>
                <p className="text-2xl text-white/80">Drawing Winners...</p>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="mt-8"
                >
                  <Sparkles className="w-12 h-12 text-yellow-300" />
                </motion.div>
              </motion.div>
            )}

            {/* Phase 2: Scrolling Names */}
            {currentPhase === 'scrolling' && (
              <motion.div
                key="scrolling"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-full w-full flex flex-col justify-center items-center py-20">
                    {/* Gradient overlays */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent z-10"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent z-10"></div>

                    {/* Scrolling names */}
                    <motion.div
                      animate={{
                        y: [0, -1000],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="space-y-6"
                    >
                      {scrollingNames.map((name, index) => (
                        <div
                          key={index}
                          className="text-3xl font-bold text-white text-center opacity-80"
                        >
                          {name}
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 3: Winner Reveal */}
            {currentPhase === 'winner' && winners[currentWinnerIndex] && (
              <motion.div
                key={`winner-${currentWinnerIndex}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="mb-8"
                >
                  <Trophy className="w-32 h-32 text-yellow-300" />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold text-white/80 mb-4">
                    {winners.length > 1 ? `Winner #${currentWinnerIndex + 1}` : 'Winner'}
                  </h2>

                  {winners[currentWinnerIndex].participant.avatar && (
                    <motion.img
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      src={winners[currentWinnerIndex].participant.avatar}
                      alt={winners[currentWinnerIndex].participant.name}
                      className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-2xl"
                    />
                  )}

                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-5xl font-bold text-white mb-4"
                  >
                    {winners[currentWinnerIndex].participant.name}
                  </motion.h1>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-2xl text-white/80"
                  >
                    @{winners[currentWinnerIndex].participant.username}
                  </motion.p>
                </motion.div>

                {winners.length > 1 && currentWinnerIndex < winners.length - 1 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-8 text-white/60 text-sm"
                  >
                    Next winner in 3 seconds...
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
