"use client";
import React from "react";
import { MapPin, Swords, Mic } from "lucide-react";

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
  return (
    /* RESPONSIVE GRID:
       Mobile: 2 columns
       Tablet: 3 columns (md:)
       Laptop/Desktop: 4 columns (lg:)
    */
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {DUMMY_PLAYERS.map((player) => (
        <div key={player.id} className="flex flex-col gap-3 group">
          {/* Card Container */}
          <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden shadow-lg border-2 border-white bg-white hover:shadow-2xl transition-all duration-300">
            {/* Image */}
            <img
              src={player.img}
              alt={player.name}
              className="w-full h-full object-cover bg-slate-100 group-hover:scale-110 transition-transform duration-500"
            />

            {/* Top Right Status Badge */}
            <div className="absolute top-3 right-3 p-2 bg-black/30 backdrop-blur-md rounded-full border border-white/20">
              <Mic className="w-3 h-3 text-white" />
            </div>

            {/* Name/Distance Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <h3 className="text-white font-bold text-lg md:text-xl">
                {player.name}, {player.age}
              </h3>
              <div className="flex items-center gap-1 text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-tight">
                <MapPin className="w-3 h-3" />
                {player.dist} away
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md border border-slate-700">
            <Swords className="w-4 h-4 text-[#00FFAB]" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
              Challenge
            </span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ActiveChallengers;
