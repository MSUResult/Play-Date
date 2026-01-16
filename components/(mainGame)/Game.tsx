"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Crown, Ghost, Info } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getComputerMove, determineWinner, Move } from "./gameLogic";
import PlayerProfile from "./PlayerProfile";
import OpponentProfile from "./OpponentProfile";
import GameBoard from "./GameBoard";
import VoiceHandler from "./VoiceHandler";

export default function Game() {
  const router = useRouter();
  const { slug } = useParams();
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [playerMove, setPlayerMove] = useState<Move>(null);
  const [opponentMove, setOpponentMove] = useState<Move>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showTutorial, setShowTutorial] = useState(true);

  // Tutorial timer
  useEffect(() => {
    const timer = setTimeout(() => setShowTutorial(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Game Timer
  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !playerMove && !showResult) {
      handleMove("ROCK");
    }
  }, [timeLeft, showResult, playerMove]);

  const handleMove = (move: Move) => {
    if (showResult || playerMove) return;

    setPlayerMove(move);
    const sMove = getComputerMove();
    setOpponentMove(sMove);

    setTimeout(() => {
      setShowResult(true);
      const result = determineWinner(move, sMove);

      let pScore = scores.player;
      let oScore = scores.opponent;
      if (result === "win") pScore++;
      if (result === "lose") oScore++;

      setScores({ player: pScore, opponent: oScore });

      setTimeout(() => {
        if (round >= 4) {
          const finalStatus = pScore >= oScore ? "win" : "lose";
          router.push(
            `/result?status=${finalStatus}&wins=${pScore}&losses=${oScore}`
          );
        } else {
          setRound((r) => r + 1);
          setPlayerMove(null);
          setOpponentMove(null);
          setShowResult(false);
          setTimeLeft(15);
        }
      }, 3000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#060908] text-white flex flex-col relative font-sans overflow-hidden">
      {/* CONSTANT VOICE CONNECTION - STATUS NEVER CHANGES */}
      <VoiceHandler status="live" onPermissionError={() => {}} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <header className="p-6 flex justify-between items-center z-10">
        <Link href="/">
          <ArrowLeft className="w-6 h-6 text-white/50" />
        </Link>
        <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
          <span className="text-emerald-400 font-black text-sm tracking-tighter">
            ROUND {round} / 4
          </span>
        </div>
        <div className="w-6" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-between p-6 z-10">
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-24 flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/30 text-xs font-bold"
            >
              <Info size={14} /> VOICE CONNECTED - LIVE CHAT ON
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center w-full max-w-md mt-4">
          {/* Profiles stay active, no turn-based dimming needed for mic */}
          <PlayerProfile isMyTurn={true} />
          <div className="text-xl font-black italic text-white/10">VS</div>
          <OpponentProfile
            name={slug}
            avatar="/downloadm.png"
            micStatus="speaking"
          />
        </div>

        <GameBoard
          playerMove={playerMove}
          opponentMove={opponentMove}
          showResult={showResult}
        />

        <div className="text-center">
          <ScoreDisplay player={scores.player} opponent={scores.opponent} />
          <p className="text-white/20 uppercase text-[10px] font-black tracking-[0.2em] mt-4 mb-2">
            Time Left
          </p>
          <motion.p
            key={timeLeft}
            className={`text-6xl font-black ${
              timeLeft < 5 ? "text-red-500" : "text-white"
            }`}
          >
            {timeLeft}s
          </motion.p>
        </div>

        <div className="flex gap-4 w-full max-w-sm pb-10">
          {["ROCK", "PAPER", "SCISSORS"].map((m) => (
            <MoveBtn
              key={m}
              emoji={m === "ROCK" ? "🪨" : m === "PAPER" ? "📄" : "✂️"}
              label={m}
              active={playerMove === m}
              onClick={() => handleMove(m as Move)}
              disabled={!!playerMove}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function ScoreDisplay({ player, opponent }: any) {
  return (
    <div className="flex gap-8 justify-center items-center bg-white/5 py-2 px-6 rounded-full border border-white/10">
      <div className="flex items-center gap-2">
        <Crown size={14} className="text-emerald-400" />{" "}
        <span className="font-bold">{player}</span>
      </div>
      <div className="w-px h-4 bg-white/10" />
      <div className="flex items-center gap-2">
        <span className="font-bold">{opponent}</span>{" "}
        <Ghost size={14} className="text-red-400" />
      </div>
    </div>
  );
}

function MoveBtn({ emoji, label, active, onClick, disabled }: any) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex-1 aspect-[4/5] rounded-[32px] flex flex-col items-center justify-center gap-2 transition-all border ${
        active
          ? "bg-emerald-500 border-emerald-400 scale-105 shadow-[0_20px_40px_rgba(16,185,129,0.3)]"
          : "bg-white/5 border-white/5 hover:bg-white/10 opacity-60"
      }`}
    >
      <span className="text-4xl">{emoji}</span>
      <span className="text-[10px] font-black tracking-widest">{label}</span>
    </button>
  );
}
