"use client";

import { useState, useRef } from "react";
import {
  Edit3,
  Mic,
  ShieldCheck,
  MapPin,
  Heart,
  Sword,
  User,
  Flame,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

export default function ProfileView({ user }: { user: any }) {
  const [isRecording, setIsRecording] = useState(false);

  // Dummy data for consistent list styling
  const activity = {
    challenges: [
      {
        id: 1,
        name: "Rahul",
        time: "2:00 PM",
        task: "Truth or Dare?",
        type: "Challenge",
      },
      {
        id: 2,
        name: "Sneha",
        time: "5:30 PM",
        task: "Voice Note Battle",
        type: "Challenge",
      },
    ],
    likes: [
      {
        id: 1,
        name: "Priya",
        time: "Just now",
        msg: "Liked your profile",
        type: "Like",
      },
      {
        id: 2,
        name: "Ananya",
        time: "2h ago",
        msg: "Interested in a match",
        type: "Like",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* 1. TOP HEADER CARD WITH EDIT BUTTON */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[45px] shadow-sm border-b border-slate-100 relative">
        {/* Floating Edit Button */}
        <button className="absolute top-6 right-6 p-3 bg-slate-50 rounded-2xl text-slate-600 border border-slate-100 active:scale-90 transition-all shadow-sm">
          <Edit3 size={20} />
        </button>

        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[32px] bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
              {user.photo ? (
                <img
                  src={user.photo}
                  className="w-full h-full object-cover"
                  alt="pfp"
                />
              ) : (
                <User className="w-10 h-10 text-slate-300" />
              )}
            </div>
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white shadow-md">
                <ShieldCheck size={16} fill="currentColor" />
              </div>
            )}
          </div>

          <div className="text-center mt-4">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {user.name}, {user.age}
            </h2>
            <p className="flex items-center justify-center gap-1 text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">
              <MapPin size={12} className="text-pink-500" />{" "}
              {user.district || "Location"}
            </p>
          </div>

          {/* Action Row */}
          <div className="mt-8 flex gap-3 w-full max-w-xs">
            <button
              className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all shadow-sm border ${
                isRecording
                  ? "bg-red-500 text-white border-red-500 animate-pulse"
                  : "bg-slate-900 text-white border-slate-900 active:scale-95"
              }`}
            >
              <Mic size={18} /> {isRecording ? "Listening" : "Voice Intro"}
            </button>
            <button className="flex-1 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center gap-2 font-black text-sm border border-blue-100 active:scale-95 transition-all">
              <ShieldCheck size={18} /> Verify
            </button>
          </div>
        </div>
      </div>

      {/* 2. ACTIVITY FEED SECTION */}
      <div className="px-5 mt-8 space-y-8">
        {/* LIKES SECTION (LIST STYLE) */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-sm font-black text-slate-400 flex items-center gap-2 tracking-widest uppercase italic">
              <Heart size={14} className="text-pink-500" fill="currentColor" />{" "}
              Recent Likes
            </h3>
          </div>

          <div className="space-y-3">
            {activity.likes.map((like) => (
              <div
                key={like.id}
                className="bg-white p-4 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-sm active:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center font-black text-pink-500 text-base border border-pink-100">
                    {like.name[0]}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">
                      {like.name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-bold">
                      {like.msg}
                    </p>
                  </div>
                </div>
                <p className="text-[9px] font-black text-slate-300 uppercase">
                  {like.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CHALLENGES SECTION (LIST STYLE) */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-sm font-black text-slate-400 flex items-center gap-2 tracking-widest uppercase italic">
              <Sword size={14} className="text-orange-500" /> Pending Challenges
            </h3>
          </div>

          <div className="space-y-3">
            {activity.challenges.map((ch) => (
              <div
                key={ch.id}
                className="bg-white p-4 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center font-bold text-orange-500 border border-orange-100">
                    <Flame size={20} />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">
                      {ch.name} challenged you
                    </p>
                    <p className="text-[11px] text-orange-600 font-black uppercase tracking-tight">
                      {ch.task}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                    {ch.time}
                  </p>
                  <button className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-xl active:scale-90 transition-all shadow-md">
                    ACCEPT
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-center px-10">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
          End of Activity Feed
        </p>
      </div>
    </div>
  );
}
