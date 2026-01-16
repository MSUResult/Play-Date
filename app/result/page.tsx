"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Crown, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

// 1. Create a separate component for the content
function ResultContent() {
  const searchParams = useSearchParams();
  const params = useParams();

  // Get the slug from params, fallback to 'player' if it's missing to avoid 'undefined' in URLs
  const slug = params?.slug || "player";

  const status = searchParams.get("status");
  const winCount = searchParams.get("wins") || "0";
  const lossCount = searchParams.get("losses") || "0";

  const isWin = status === "win";

  useEffect(() => {
    const playDonkeySound = () => {
      if (!isWin) {
        const audio = new Audio("/donkey-mock.mp3");
        audio.volume = 0.7;
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise.catch(() => {
            const playOnInteraction = () => {
              audio.play();
              window.removeEventListener("click", playOnInteraction);
            };
            window.addEventListener("click", playOnInteraction);
          });
        }
      }
    };

    const timer = setTimeout(playDonkeySound, 300);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", () => {});
    };
  }, [isWin]);

  return (
    <div className="min-h-screen bg-[#0A0F0D] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Score Header */}
      <div className="mb-6 text-white/30 font-bold tracking-widest text-sm">
        FINAL SCORE: {winCount} - {lossCount}
      </div>

      <div className="flex items-center gap-8 mb-12">
        {/* PLAYER */}
        <div className="flex flex-col items-center gap-3">
          <div
            className={`relative p-1 rounded-2xl ${
              isWin
                ? "bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                : "bg-slate-800"
            }`}
          >
            <img
              src="/downloade.png"
              className="w-20 h-20 rounded-xl object-cover"
              alt="You"
            />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              {isWin ? (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <Crown className="text-yellow-500 w-10 h-10 fill-yellow-500" />
                </motion.div>
              ) : (
                <span className="text-3xl">🫏</span>
              )}
            </div>
          </div>
          <span className="text-white font-bold tracking-tighter">
            {isWin ? "KING" : "DONKEY"}
          </span>
        </div>

        <div className="text-white/10 font-black italic text-2xl">VS</div>

        {/* OPPONENT */}
        <div className="flex flex-col items-center gap-3">
          <div
            className={`relative p-1 rounded-2xl ${
              !isWin
                ? "bg-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)]"
                : "bg-slate-800"
            }`}
          >
            <img
              src="/downloadm.png"
              className="w-20 h-20 rounded-xl object-cover"
              alt="Opponent"
            />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              {!isWin ? (
                <Crown className="text-yellow-500 w-10 h-10 fill-yellow-500" />
              ) : (
                <span className="text-3xl">🫏</span>
              )}
            </div>
          </div>
          <span className="text-white font-bold tracking-tighter">
            {!isWin ? "KING" : "DONKEY"}
          </span>
        </div>
      </div>

      {/* Result Text */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1
          className={`text-6xl font-black mb-2 tracking-tighter ${
            isWin ? "text-emerald-400" : "text-pink-500"
          }`}
        >
          {isWin ? "VICTORY!" : "DEFEATED!"}
        </h1>
        <p className="text-white/40 font-medium tracking-widest uppercase text-xs">
          {isWin
            ? "You crushed the competition"
            : `${slug} is laughing at you!`}
        </p>
      </motion.div>

      {/* Buttons */}
      <div className="flex flex-col w-full max-w-xs gap-4">
        {/* Fixed Link to prevent 'undefined' */}
        <Link href={`/${slug}/play`} className="w-full">
          <button className="w-full bg-emerald-500 text-black h-16 rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-transform">
            <RotateCcw size={20} /> REMATCH
          </button>
        </Link>
        <Link href="/" className="w-full">
          <button className="w-full bg-white/5 text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-3 border border-white/10">
            <Home size={20} /> QUIT GAME
          </button>
        </Link>
      </div>

      {!isWin && (
        <motion.div
          animate={{ x: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 0.1 }}
          className="mt-10 text-pink-500 font-bold italic"
        >
          Dhahu Dhahu! 🔊
        </motion.div>
      )}
    </div>
  );
}

// 2. Wrap everything in Suspense for the build to pass
export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0F0D] flex items-center justify-center text-white">
          Loading Results...
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
