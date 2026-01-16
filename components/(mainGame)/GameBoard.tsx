"use client";
import { motion, AnimatePresence } from "framer-motion";

const MOVE_EMOJIS = {
  ROCK: "🪨",
  PAPER: "📄",
  SCISSORS: "✂️",
};

export default function GameBoard({
  playerMove,
  opponentMove,
  showResult,
}: any) {
  return (
    <div className="flex items-center justify-center gap-8 my-8 relative">
      <div
        className={`w-28 h-32 rounded-[32px] border-2 border-dashed ${
          playerMove
            ? "border-emerald-500/50 bg-emerald-500/5"
            : "border-white/10 bg-white/5"
        } flex items-center justify-center transition-all duration-500`}
      >
        <AnimatePresence mode="wait">
          {playerMove ? (
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-6xl drop-shadow-2xl"
            >
              {MOVE_EMOJIS[playerMove as keyof typeof MOVE_EMOJIS]}
            </motion.span>
          ) : (
            <span className="text-white/10 text-4xl font-black">?</span>
          )}
        </AnimatePresence>
      </div>

      <div className="text-2xl font-black italic text-emerald-400 opacity-20">
        VS
      </div>

      <div
        className={`w-28 h-32 rounded-[32px] border-2 border-dashed ${
          showResult
            ? "border-pink-500/50 bg-pink-500/5"
            : "border-white/10 bg-white/5"
        } flex items-center justify-center transition-all duration-500 overflow-hidden`}
      >
        <AnimatePresence mode="wait">
          {showResult ? (
            <motion.span
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-6xl drop-shadow-2xl"
            >
              {MOVE_EMOJIS[opponentMove as keyof typeof MOVE_EMOJIS]}
            </motion.span>
          ) : opponentMove ? (
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity }}
              className="text-3xl"
            >
              ❓
            </motion.div>
          ) : (
            <span className="text-white/10 text-4xl font-black">?</span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
