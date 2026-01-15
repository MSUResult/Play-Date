"use client";
import React, { useEffect, useState } from "react";
import { MapPin, Swords, Mic, ShieldCheck } from "lucide-react";

// Keep your dummy players as backup
const DUMMY_PLAYERS = [
  {
    id: 1,
    name: "Maya",
    age: 24,
    dist: "2km",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
  },
  {
    id: 2,
    name: "Liam",
    age: 27,
    dist: "5km",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
  },
  {
    id: 3,
    name: "Sarah",
    age: 22,
    dist: "1km",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 4,
    name: "James",
    age: 25,
    dist: "10km",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
  // Adding two more for better desktop filling
  {
    id: 5,
    name: "Zoe",
    age: 23,
    dist: "3km",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
  },
  {
    id: 6,
    name: "Noah",
    age: 26,
    dist: "7km",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
  },
];

const ActiveChallengers = () => {
  const [realPlayers, setRealPlayers] = useState([]);

  useEffect(() => {
    const fetchRealPlayers = async () => {
      try {
        const res = await fetch("/api/players");
        const data = await res.json();
        setRealPlayers(data.users || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRealPlayers();
  }, []);

  const allPlayers = [...realPlayers, ...DUMMY_PLAYERS];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {allPlayers.map((player) => {
        // Logic to check if user is truly "Live" (active in last 5 mins)
        const isRecentlyOnline =
          player.isReal &&
          new Date().getTime() - new Date(player.lastActive).getTime() <
            5 * 60 * 1000;

        return (
          <div key={player.id} className="flex flex-col gap-3 group">
            <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden shadow-lg border-2 border-white bg-white hover:shadow-2xl transition-all duration-300">
              <img
                src={player.img}
                alt={player.name}
                className="w-full h-full object-cover bg-slate-100 group-hover:scale-110 transition-transform duration-500"
              />

              {/* LIVE BADGE - Only for real users active right now */}
              {isRecentlyOnline && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-green-500 rounded-full shadow-lg shadow-green-500/40">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  <span className="text-[9px] font-black text-white uppercase tracking-tighter">
                    Live
                  </span>
                </div>
              )}

              {/* Verified Badge */}
              {player.isVerified && (
                <div className="absolute top-3 right-10 p-1 bg-blue-500 rounded-full border border-white">
                  <ShieldCheck
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                  />
                </div>
              )}

              <div className="absolute top-3 right-3 p-2 bg-black/30 backdrop-blur-md rounded-full border border-white/20">
                <Mic className="w-3 h-3 text-white" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                <h3 className="text-white font-bold text-lg md:text-xl">
                  {player.name}, {player.age}
                </h3>
                <div className="flex items-center gap-1 text-white/80 text-[10px] md:text-xs font-bold uppercase">
                  <MapPin className="w-3 h-3 text-pink-500" />
                  {player.dist}
                </div>
              </div>
            </div>

            <button className="w-full py-3 bg-slate-900 hover:bg-pink-600 text-white rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md group">
              <Swords className="w-4 h-4 text-[#00FFAB] group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
                Challenge
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ActiveChallengers;
