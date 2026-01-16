"use client";
import React, { useEffect, useState } from "react";
import { Heart, Swords, Flame } from "lucide-react";

// Helper to show 2m, 1h ago etc.
const formatTime = (date: any) => {
  if (!date) return "now";
  const now = new Date().getTime();
  const past = new Date(date).getTime();
  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// DUMMY DATA (Kept in frontend only as requested)
const DUMMY_CHALLENGES = [
  {
    id: "c1",
    name: "Zoe",
    task: "10 PUSHUPS",
    time: new Date(Date.now() - 120000),
  }, // 2m ago
  {
    id: "c2",
    name: "Noah",
    task: "SQUAT JUMPS",
    time: new Date(Date.now() - 3600000),
  }, // 1h ago
];

const DUMMY_LIKES = [
  {
    id: "d1",
    name: "Riya",
    msg: "Wants to play!",
    photo: null,
    time: new Date(Date.now() - 300000),
    isDummy: true,
  },
];

export function LikeCard({ like }: { like: any }) {
  return (
    <div className="bg-white p-4 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {like.photo ? (
          <img
            src={like.photo}
            className="w-10 h-10 rounded-2xl object-cover border border-slate-100"
            alt={like.name}
          />
        ) : (
          <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center font-black text-pink-500 text-xs border border-pink-100">
            {like.name[0]}
          </div>
        )}
        <div>
          <p className="font-black text-slate-800 text-sm">{like.name}</p>
          <p className="text-[10px] text-slate-400 font-bold">{like.msg}</p>
        </div>
      </div>
      {/* Time replaces the button */}
      <span className="text-[10px] font-black text-slate-300 uppercase italic">
        {formatTime(like.time)}
      </span>
    </div>
  );
}

export function ChallengeCard({ ch }: { ch: any }) {
  return (
    <div className="bg-white p-4 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
          <Flame size={18} />
        </div>
        <div>
          <p className="font-black text-slate-800 text-sm">
            {ch.name} challenged you
          </p>
          <p className="text-[10px] text-orange-600 font-black uppercase italic">
            {ch.task}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[9px] font-bold text-slate-300 uppercase">
          {formatTime(ch.time)}
        </span>
        <button className="bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg active:scale-95 shadow-md">
          ACCEPT
        </button>
      </div>
    </div>
  );
}

export default function ActivityTab() {
  const [realData, setRealData] = useState({ likes: [], challenges: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch("/api/notifications");
        const json = await res.json();
        setRealData(json);
      } catch (err) {
        console.error("Failed to load activity");
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center animate-pulse text-slate-300 font-black italic">
        FETCHING UPDATES...
      </div>
    );

  // Combine Real + Dummy
  const allLikes = [...realData.likes, ...DUMMY_LIKES];
  const allChallenges = [...realData.challenges, ...DUMMY_CHALLENGES];

  return (
    <div className="space-y-8">
      {/* LIKES SECTION */}
      <div>
        <h3 className="text-[10px] font-black text-slate-400 flex items-center gap-2 tracking-[0.2em] uppercase mb-4">
          <Heart size={12} className="text-pink-500" fill="currentColor" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {allLikes.map((like: any) => (
            <LikeCard key={like.id} like={like} />
          ))}
        </div>
      </div>

      {/* CHALLENGES SECTION */}
      <div>
        <h3 className="text-[10px] font-black text-slate-400 flex items-center gap-2 tracking-[0.2em] uppercase mb-4">
          <Swords size={12} className="text-orange-500" /> Pending Challenges
        </h3>
        <div className="space-y-3">
          {allChallenges.map((ch: any) => (
            <ChallengeCard key={ch.id} ch={ch} />
          ))}
        </div>
      </div>
    </div>
  );
}
