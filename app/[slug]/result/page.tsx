"use client";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Crown, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ResultPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status"); // 'win', 'lose', or 'draw'
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Auto-play mocking sound if the player lost
    if (status === "lose") {
      audioRef.current = new Audio("/donkey-mock.mp3"); // Put your 'dhahu dhahu' file in public folder
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play blocked until interaction"));
    }
  }, [status]);

  const isWin = status === "win";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Top Profiles Section */}
      <div className="flex items-center gap-8 mb-12">
        {/* PLAYER */}
        <div className="flex flex-col items-center gap-3">
          <div
            className={`relative p-1 rounded-2xl ${
              isWin
                ? "bg-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.4)]"
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
                <span className="text-3xl">🫏</span> // Donkey for Loser
              )}
            </div>
          </div>
          <span className="text-white font-bold">
            {isWin ? "KING" : "DONKEY"}
          </span>
        </div>

        <div className="text-white/20 font-black italic text-2xl">VS</div>

        {/* OPPONENT (SARAH) */}
        <div className="flex flex-col items-center gap-3">
          <div
            className={`relative p-1 rounded-2xl ${
              !isWin
                ? "bg-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.4)]"
                : "bg-slate-800"
            }`}
          >
            <img
              src="/downloadm.png"
              className="w-20 h-20 rounded-xl object-cover"
              alt="Sarah"
            />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              {!isWin ? (
                <Crown className="text-yellow-500 w-10 h-10 fill-yellow-500" />
              ) : (
                <span className="text-3xl">🫏</span>
              )}
            </div>
          </div>
          <span className="text-white font-bold">
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
          className={`text-6xl font-black mb-2 ${
            isWin ? "text-yellow-500" : "text-slate-500"
          }`}
        >
          {isWin ? "VICTORY!" : "DEFEATED!"}
        </h1>
        <p className="text-white/40 font-medium tracking-widest uppercase">
          {isWin ? "You crushed the competition" : "Sarah is laughing at you!"}
        </p>
      </motion.div>

      {/* Buttons */}
      <div className="flex flex-col w-full max-w-xs gap-4">
        <Link href="/play" className="w-full">
          <button className="w-full bg-white text-black h-16 rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-transform">
            <RotateCcw size={20} /> REMATCH
          </button>
        </Link>

        <Link href="/" className="w-full">
          <button className="w-full bg-white/5 text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-3 border border-white/10">
            <Home size={20} /> QUIT GAME
          </button>
        </Link>
      </div>

      {/* Fun Message for Donkey */}
      {!isWin && (
        <motion.div
          animate={{ x: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 0.1 }}
          className="mt-10 text-[#FF4D4D] font-bold italic"
        >
          Dhahu Dhahu! 🔊
        </motion.div>
      )}
    </div>
  );
}
