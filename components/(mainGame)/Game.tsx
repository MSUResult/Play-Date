"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ArrowLeft, Sparkles, Mic, Radio } from "lucide-react";
import { Toaster } from "sonner";
import Link from "next/link";
import {
  getBestMove,
  calculateWinner,
  isBoardFull,
  type SquareValue,
} from "./gameLogic";
import PlayerProfile from "./PlayerProfile";
import GameBoard from "./GameBoard";
import OpponentProfile from "./OpponentProfile";

const AI_TIPS = [
  "Compliment their move!",
  "Ask them: 'Coffee or Tea?'",
  "Say: 'You're good at this!'",
];

export default function Game() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState<
    "playing" | "won" | "lost" | "draw"
  >("playing");
  const [micStatus, setMicStatus] = useState<
    "idle" | "listening" | "speaking" | "live"
  >("live");
  const [aiTip, setAiTip] = useState(AI_TIPS[0]);

  useEffect(() => {
    if (gameStatus !== "playing") {
      setMicStatus("idle");
      return;
    }
    setMicStatus(isMyTurn ? "listening" : "speaking");
  }, [isMyTurn, gameStatus]);

  const handleSquareClick = (i: number) => {
    if (squares[i] || gameStatus !== "playing" || !isMyTurn) return;
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    const newSquares = [...squares];
    newSquares[i] = "X";
    setSquares(newSquares);
    setIsMyTurn(false);
    if (checkEndGame(newSquares)) return;
    setAiTip(AI_TIPS[Math.floor(Math.random() * AI_TIPS.length)]);
    setTimeout(() => handleOpponentMove(newSquares), 1200);
  };

  const handleOpponentMove = (currentSquares: SquareValue[]) => {
    const move = getBestMove(currentSquares);
    if (move === -1) return;
    const newSquares = [...currentSquares];
    newSquares[move] = "O";
    setSquares(newSquares);
    setIsMyTurn(true);
    checkEndGame(newSquares);
  };

  const checkEndGame = (sq: SquareValue[]) => {
    const winner = calculateWinner(sq);
    if (winner) {
      setGameStatus(winner === "X" ? "won" : "lost");
      return true;
    }
    if (isBoardFull(sq)) {
      setGameStatus("draw");
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F3F0F5] flex flex-col relative overflow-hidden font-sans">
      <Toaster position="top-center" richColors />

      {/* Header with Glassmorphism */}
      <header className="p-6 flex justify-between items-center bg-white/40 backdrop-blur-xl sticky top-0 z-50 border-b border-white/20">
        <Link href="/">
          <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
        </Link>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-[#00FFAB] rounded-full animate-pulse shadow-[0_0_8px_#00FFAB]" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Live Call
            </span>
          </div>
          <span className="text-sm font-black text-slate-800">SARAH</span>
        </div>
        <button className="p-2 hover:bg-white/50 rounded-full relative">
          <MessageCircle className="w-6 h-6 text-slate-600" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-tr from-[#6366F1] to-[#EC4899] rounded-full border-2 border-white" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div className="flex justify-between items-center w-full max-w-sm mb-12">
          <PlayerProfile isMyTurn={isMyTurn} />
          <div className="flex flex-col items-center gap-1">
            <Radio className="text-indigo-300 w-5 h-5 animate-pulse" />
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
          </div>
          <OpponentProfile
            name="Sarah"
            avatar="/downloadm.png"
            isMyTurn={isMyTurn}
            micStatus={micStatus}
          />
        </div>

        <GameBoard
          squares={squares}
          gameStatus={gameStatus}
          isMyTurn={isMyTurn}
          onSquareClick={handleSquareClick}
        />

        <AnimatePresence>
          {isMyTurn && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex gap-3 bg-white/70 backdrop-blur-lg p-4 rounded-3xl border border-white shadow-xl max-w-[280px]"
            >
              <Sparkles className="w-5 h-5 text-[#6366F1] shrink-0" />
              <p className="text-xs font-semibold text-indigo-900 leading-relaxed">
                {aiTip}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer with Glassmorphism */}
      <footer className="h-24 bg-white/60 backdrop-blur-2xl border-t border-white/30 flex items-center justify-around px-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-2xl transition-colors ${
              micStatus === "listening"
                ? "bg-indigo-100 text-indigo-600"
                : "bg-white/50 text-slate-400"
            }`}
          >
            <Mic
              size={20}
              className={micStatus === "listening" ? "animate-bounce" : ""}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-400">
              Your Mic
            </span>
            <span className="text-xs font-bold text-slate-700">
              {micStatus === "listening" ? "Active" : "Muted"}
            </span>
          </div>
        </div>
        <div className="h-8 w-[1px] bg-indigo-100" />
        <div className="flex items-center gap-2">
          <div className="flex gap-1 items-end h-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-500 ${
                  micStatus === "speaking"
                    ? "bg-indigo-500 animate-pulse"
                    : "bg-slate-200"
                }`}
                style={{
                  height:
                    micStatus === "speaking"
                      ? `${Math.random() * 100}%`
                      : "40%",
                }}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-500">Live Audio</span>
        </div>
      </footer>
    </div>
  );
}
