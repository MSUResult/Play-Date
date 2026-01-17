"use client";
import React, { useState } from "react";
import { Heart, Zap } from "lucide-react";
import ActiveChallengers from "./ActiveChallengers";

const Discover = () => {
  const [likeCount, setLikeCount] = useState(0);
  return (
    <main className="min-h-screen bg-[#F3F0F5] pb-24 font-sans">
      {/* Container to keep content centered and appropriately sized on desktop */}
      <div className="max-w-6xl mx-auto">
        {/* Top Header Section */}
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span className="text-sm font-bold text-slate-700">
              {likeCount} Likes
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
            <span className="text-white text-xs font-bold">YOU</span>
          </div>
        </header>

        <div className="px-6 space-y-8">
          {/* Live Seminar Card - Adjusted height and width for Desktop */}
          <section className="relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00DDAA] to-[#00BA99] opacity-90 rounded-[32px]" />
            <div className="relative p-6 md:p-10 flex justify-between items-center z-10">
              <div className="max-w-[70%] lg:max-w-[50%]">
                <h2 className="text-white font-black text-2xl md:text-3xl tracking-tight uppercase italic">
                  Live Seminar
                </h2>
                <p className="text-white/80 text-xs md:text-sm mt-1 font-medium leading-tight">
                  Connect with our live dating coach to master the art of
                  conversation.
                </p>
              </div>
              <button className="w-14 h-14 md:w-16 md:h-16 bg-black/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 group-hover:bg-black/30 transition-all shadow-xl">
                <Zap className="text-white fill-white w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>
          </section>

          {/* Active Challengers Header */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase">
                  Active Challengers
                </h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 bg-[#00FFAB] rounded-full animate-pulse" />
                  <span className="text-[10px] md:text-xs font-bold text-[#00BA99] uppercase tracking-widest">
                    1,528 Online
                  </span>
                </div>
              </div>
            </div>

            {/* Info bar - Made thinner on desktop */}
            <div className="bg-white/40 backdrop-blur-lg border border-white p-4 rounded-3xl mb-6 inline-block w-full lg:w-auto lg:px-8">
              <p className="text-xs md:text-sm text-slate-600 font-semibold leading-relaxed">
                Challenge them now. You get 2 matches/day. Need more?{" "}
                <span className="text-indigo-600 font-bold underline cursor-pointer hover:text-indigo-800">
                  Pay ₹10 for Unlimited
                </span>
              </p>
            </div>

            {/* Grid Component */}
            <ActiveChallengers setLikeCount={setLikeCount} />
          </section>
        </div>
      </div>
    </main>
  );
};
export default Discover;
