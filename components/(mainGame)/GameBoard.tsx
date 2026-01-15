"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X as XIcon, Circle, RefreshCw } from "lucide-react";
import { SquareValue } from "./gameLogic";

export default function GameBoard({
  squares,
  gameStatus,
  isMyTurn,
  onSquareClick,
}: any) {
  return (
    <div className="relative w-full max-w-[340px] aspect-square">
      {/* THE DARK BOARD:
        - Used 'bg-slate-900/80' for a deep, dark glass look.
        - Added 'border-slate-700/50' for a sharp, clear edge.
        - Increased 'backdrop-blur-3xl' for that heavy frosted glass effect.
      */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900/85 backdrop-blur-3xl rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-700/50 h-full relative overflow-hidden">
        {/* Subtle background glow inside the board */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500/10 blur-[80px] pointer-events-none" />

        {squares.map((value: SquareValue, i: number) => (
          <button
            key={i}
            onClick={() => onSquareClick(i)}
            disabled={!!value || gameStatus !== "playing" || !isMyTurn}
            className={`group relative flex items-center justify-center rounded-[24px] transition-all duration-300 
              ${
                !value
                  ? "bg-white/5 hover:bg-white/10 border-white/5"
                  : "bg-white/10 shadow-lg border-white/20"
              }
              aspect-square w-full border border-white/10 overflow-hidden`}
          >
            <AnimatePresence mode="wait">
              {value === "X" && (
                <motion.div
                  key="X"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.6)] z-10"
                >
                  <XIcon size={40} strokeWidth={3} />
                </motion.div>
              )}
              {value === "O" && (
                <motion.div
                  key="O"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.6)] z-10"
                >
                  <Circle size={36} strokeWidth={3} />
                </motion.div>
              )}
              {!value && isMyTurn && (
                <div className="opacity-0 group-hover:opacity-20 transition-opacity">
                  <XIcon size={24} className="text-indigo-300" />
                </div>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      {/* Game Over Overlay - High Contrast Dark */}
      {gameStatus !== "playing" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl z-20 rounded-[40px] flex flex-col items-center justify-center p-8 text-center border border-white/20 shadow-2xl"
        >
          <h2 className="text-3xl font-black text-white mb-6 drop-shadow-md">
            {gameStatus === "won"
              ? "Victory! 🏆"
              : gameStatus === "lost"
              ? "Nice Try! ❤️"
              : "Draw! 🤝"}
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white h-14 rounded-2xl font-extrabold flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(99,102,241,0.3)] active:scale-95 transition-transform"
          >
            <RefreshCw size={18} /> Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}
