"use client";
import { useAuth } from "@/context/AuthContext";

export default function PlayerProfile({ isMyTurn }: { isMyTurn: boolean }) {
  const { user, loading } = useAuth();
  const name = user?.name || "You";
  const photo = user?.photo || "/downloade.png";

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-4 rounded-[32px] transition-all duration-500 w-[140px] border 
      ${
        isMyTurn
          ? "bg-white/80 border-white shadow-2xl scale-110 z-20"
          : "bg-white/20 border-white/10 opacity-60 scale-95"
      }`}
    >
      {/* Aura Effect */}
      {isMyTurn && (
        <div className="absolute inset-0 bg-indigo-400/20 blur-3xl rounded-full animate-pulse" />
      )}

      <div className="relative mb-3 z-10">
        <img
          src={photo}
          className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
          alt={name}
        />
        {isMyTurn && (
          <div className="absolute inset-0 border-2 border-indigo-400 rounded-full animate-ping opacity-40" />
        )}
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-[#6366F1] to-[#EC4899] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white">
          X
        </div>
      </div>

      <span
        className={`text-[10px] font-bold uppercase tracking-wider ${
          isMyTurn ? "text-indigo-600" : "text-slate-400"
        }`}
      >
        {isMyTurn ? "Your Turn" : "Waiting"}
      </span>
      <span className="text-slate-800 font-bold text-sm mt-0.5">{name}</span>
    </div>
  );
}
