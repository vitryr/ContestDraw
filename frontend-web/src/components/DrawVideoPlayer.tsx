import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Play, Pause, RotateCcw } from "lucide-react";

interface Winner {
  position: number;
  name: string;
  username: string;
}

interface DrawVideoPlayerProps {
  title: string;
  participantCount: number;
  winners: Winner[];
  primaryColor?: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
}

export interface DrawVideoPlayerHandle {
  getElement: () => HTMLDivElement | null;
  play: () => void;
  pause: () => void;
  restart: () => void;
  isPlaying: boolean;
}

type Phase = "intro" | "spinning" | "reveal" | "summary";

const DrawVideoPlayer = forwardRef<DrawVideoPlayerHandle, DrawVideoPlayerProps>(({
  title,
  participantCount,
  winners,
  primaryColor = "#8b5cf6",
  width = 360,
  height = 640,
  autoPlay = true,
  loop = true,
  showControls = true,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [spinningName, setSpinningName] = useState("");

  // Animation timeline
  useEffect(() => {
    if (!isPlaying) return;

    let timeout: NodeJS.Timeout;

    switch (phase) {
      case "intro":
        timeout = setTimeout(() => setPhase("spinning"), 2000);
        break;
      case "spinning":
        timeout = setTimeout(() => {
          setCurrentWinnerIndex(0);
          setPhase("reveal");
        }, 3000);
        break;
      case "reveal":
        if (currentWinnerIndex < winners.length - 1) {
          timeout = setTimeout(() => {
            setCurrentWinnerIndex((prev) => prev + 1);
          }, 1500);
        } else {
          timeout = setTimeout(() => setPhase("summary"), 1500);
        }
        break;
      case "summary":
        if (loop) {
          timeout = setTimeout(() => {
            setPhase("intro");
            setCurrentWinnerIndex(0);
          }, 3000);
        }
        break;
    }

    return () => clearTimeout(timeout);
  }, [phase, currentWinnerIndex, isPlaying, winners.length, loop]);

  // Spinning name effect
  useEffect(() => {
    if (phase !== "spinning" || !isPlaying) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * winners.length);
      setSpinningName(winners[randomIndex]?.name || "...");
    }, 100);

    return () => clearInterval(interval);
  }, [phase, isPlaying, winners]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleRestart = () => {
    setPhase("intro");
    setCurrentWinnerIndex(0);
    setIsPlaying(true);
  };

  // Expose methods via ref for video export
  useImperativeHandle(ref, () => ({
    getElement: () => containerRef.current,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    restart: handleRestart,
    isPlaying,
  }));

  return (
    <div ref={containerRef} className="relative" style={{ width, height }}>
      {/* Video Container */}
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          width,
          height,
          background: "linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)",
        }}
      >
        <AnimatePresence mode="wait">
          {/* Intro Phase */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="text-5xl mb-6"
              >
                🎉
              </motion.div>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-center mb-2"
                style={{ color: primaryColor }}
              >
                CONTEST DRAW
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white text-center text-lg mb-4"
              >
                {title}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-400 text-sm"
              >
                {participantCount} participants
              </motion.p>
            </motion.div>
          )}

          {/* Spinning Phase */}
          {phase === "spinning" && (
            <motion.div
              key="spinning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6"
            >
              <motion.p
                className="text-xl font-bold mb-8"
                style={{ color: primaryColor }}
              >
                Selecting Winner...
              </motion.p>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 rounded-full border-4 flex items-center justify-center mb-6"
                style={{
                  borderColor: primaryColor,
                  boxShadow: `0 0 30px ${primaryColor}40`,
                }}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ background: `${primaryColor}20` }}
                >
                  <span className="text-white font-bold text-sm text-center px-2">
                    {spinningName}
                  </span>
                </div>
              </motion.div>
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </motion.div>
          )}

          {/* Reveal Phase */}
          {phase === "reveal" && winners[currentWinnerIndex] && (
            <motion.div
              key={`reveal-${currentWinnerIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6"
            >
              {/* Confetti effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -20, x: (i % 6) * 60, opacity: 0 }}
                    animate={{
                      y: height + 20,
                      opacity: [0, 1, 1, 0],
                      rotate: 360,
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                    className="absolute text-2xl"
                  >
                    {["🎊", "🎉", "✨", "⭐"][i % 4]}
                  </motion.div>
                ))}
              </div>

              <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xl font-bold mb-6"
                style={{ color: primaryColor }}
              >
                WINNER #{winners[currentWinnerIndex].position}
              </motion.p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 8 }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, #8b5cf6)`,
                  boxShadow: `0 0 40px ${primaryColor}60`,
                }}
              >
                <span className="text-white text-3xl font-bold">
                  {winners[currentWinnerIndex].name.charAt(0).toUpperCase()}
                </span>
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white text-xl font-bold mb-1"
              >
                {winners[currentWinnerIndex].name}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400"
              >
                @{winners[currentWinnerIndex].username}
              </motion.p>
            </motion.div>
          )}

          {/* Summary Phase */}
          {phase === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6"
            >
              <div className="text-4xl mb-4">🎊</div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: primaryColor }}
              >
                WINNERS
              </h2>
              <p className="text-white text-sm mb-6 text-center">{title}</p>
              <div className="space-y-3 w-full max-w-[280px]">
                {winners.map((winner, index) => (
                  <motion.div
                    key={winner.position}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.15 }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className={`font-bold ${index === 0 ? "text-xl" : "text-base"}`}
                      style={{ color: index === 0 ? primaryColor : "#fff" }}
                    >
                      {winner.position}.
                    </span>
                    <span
                      className={`${index === 0 ? "font-bold text-lg" : ""}`}
                      style={{ color: index === 0 ? primaryColor : "#fff" }}
                    >
                      {winner.name}
                    </span>
                    <span className="text-gray-500 text-sm">
                      @{winner.username}
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="text-gray-600 text-xs mt-6">
                Powered by Cleack • Fair & Transparent
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 rounded-full px-3 py-2">
          <button
            onClick={handlePlayPause}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white" />
            )}
          </button>
          <button
            onClick={handleRestart}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
    </div>
  );
});

DrawVideoPlayer.displayName = "DrawVideoPlayer";

export default DrawVideoPlayer;
