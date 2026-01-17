"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-[rgb(253,242,248)] px-4 py-10 md:py-20 font-sans">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-14">
        <div className="flex justify-center gap-3 mb-6 animate-bounce">
          <span className="text-pink-500 text-3xl">👊</span>
          <span className="text-purple-400 text-3xl">✋</span>
          <span className="text-blue-500 text-3xl">✌️</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent leading-tight">
          Rock Paper Scissors <br /> A Fun Dating Experience
        </h1>

        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto font-semibold">
          Why <span className="text-pink-500 font-bold">swipe</span> when you
          can play? <span className="text-pink-500 font-bold">Defeat</span> her
          in game and <span className="text-pink-500 font-bold">win</span> her
          in life 💖
        </p>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
        {/* Left Profile */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-[300px] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl bg-white hover:scale-105 transition">
            <Image
              src={user?.photo || "/downloade.png"}
              alt={user?.name || "User"}
              fill
              className="object-cover"
              priority
            />
            {user && (
              <div className="absolute bottom-4 left-4 bg-white/30 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
                {user.name}
              </div>
            )}
          </div>
        </div>

        {/* Game Card */}
        <div className="flex justify-center">
          <div className="relative bg-white p-7 rounded-[42px] shadow-2xl border-8 border-white w-full max-w-[300px] flex flex-col items-center before:absolute before:inset-0 before:rounded-[42px] before:bg-gradient-to-r before:from-pink-500 before:to-blue-500 before:blur-xl before:opacity-30">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 z-10">
              Challenge Now
            </p>

            <h2 className="text-xl font-black text-gray-800 mb-6 text-center z-10">
              ROCK <br /> PAPER <br /> SCISSORS
            </h2>

            <div className="relative h-24 w-full flex justify-center items-center mb-8 z-10">
              <span className="text-5xl absolute -rotate-12 -translate-x-10 animate-pulse">
                👊
              </span>
              <span className="text-6xl absolute z-10 animate-bounce">✋</span>
              <span className="text-5xl absolute rotate-12 translate-x-10 animate-pulse">
                ✌️
              </span>
            </div>

            <button
              onClick={() => router.push("/play")}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-blue-500 text-white font-extrabold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-pink-300 z-10"
            >
              ▶ Play & Match
            </button>
          </div>
        </div>

        {/* Right Profile */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-[300px] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition">
            <Image
              src="/downloadm.png"
              alt="Opponent"
              fill
              className="object-cover"
            />
            <div className="absolute top-4 right-4 bg-green-500 h-3 w-3 rounded-full shadow-lg" />
          </div>
        </div>
      </div>
    </main>
  );
}
