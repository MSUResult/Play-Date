"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-[rgb(253,242,248)] px-4 py-10 md:py-20 font-sans">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="flex justify-center gap-2 mb-4">
          <span className="text-pink-500 text-2xl">👊</span>
          <span className="text-purple-400 text-2xl">✋</span>
          <span className="text-blue-500 text-2xl">✌️</span>
        </div>

        {/* Gradient Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent leading-tight">
          Rock Paper Scissors – A Fun Dating Experience
        </h1>

        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Why <span className="font-bold text-pink-500">swipe</span> when you
          can play? Connect through a classic game of strategy and luck.
        </p>
      </div>    

      {/* Main Feature Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Left Photo */}
        <div className="order-2 md:order-1 flex justify-center">
          <div className="relative w-full max-w-[300px] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl bg-white">
            <Image
              src={user?.photo ? user.photo : "/downloade.png"}
              alt={user?.name || "User"}
              fill
              className="object-cover"
              priority
            />
            {user && (
              <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-xs font-bold">
                Logged in as {user.name}
              </div>
            )}
          </div>
        </div>

        {/* Center Game Board - UPDATED TO ROCK PAPER SCISSORS */}
        <div className="order-1 md:order-2 flex flex-col items-center">
          <div className="bg-white p-6 rounded-[40px] shadow-2xl border-8 border-white w-full max-w-[280px] flex flex-col items-center">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Challenge the Computer
            </p>

            <h2 className="text-xl font-black text-gray-800 mb-6 text-center">
              ROCK <br /> PAPER <br /> SCISSORS
            </h2>

            {/* Dynamic Game Icons */}
            <div className="relative h-24 w-full flex justify-center items-center mb-8">
              <span className="text-5xl absolute -rotate-12 translate-x-[-40px] drop-shadow-md">
                👊
              </span>
              <span className="text-6xl absolute z-10 translate-y-[-10px] drop-shadow-lg">
                ✋
              </span>
              <span className="text-5xl absolute rotate-12 translate-x-[40px] drop-shadow-md">
                ✌️
              </span>
            </div>

            {/* Start Button */}
            <button
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-pink-200"
              onClick={() => router.push("/play")}
            >
              ▶ Start Play
            </button>
          </div>
        </div>

        {/* Right Photo */}
        <div className="order-3 flex justify-center">
          <div className="relative w-full max-w-[300px] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/downloadm.png"
              alt="Opponent"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
