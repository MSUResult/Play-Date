"use client";
export default function OpponentProfile({
  name,
  avatar,
  isMyTurn,
  micStatus,
}: any) {
  const isSpeaking = micStatus === "speaking";

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-4 rounded-[32px] transition-all duration-500 w-[140px] border
      ${
        isSpeaking
          ? "bg-white/80 border-white shadow-2xl scale-110 z-20"
          : "bg-white/20 border-white/10 opacity-60 scale-95"
      }`}
    >
      {/* Aura Effect */}
      {isSpeaking && (
        <div className="absolute inset-0 bg-magenta-400/20 blur-3xl rounded-full animate-pulse" />
      )}

      <div className="relative mb-3 z-10">
        <img
          src={avatar}
          className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
          alt={name}
        />
        {isSpeaking && (
          <div className="absolute inset-0 border-2 border-magenta-400 rounded-full animate-ping opacity-40" />
        )}
        <div className="absolute -bottom-1 -right-1 bg-slate-200 text-slate-600 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white">
          O
        </div>
      </div>
      <span
        className={`text-[10px] font-bold uppercase tracking-wider ${
          isSpeaking ? "text-magenta-500" : "text-slate-400"
        }`}
      >
        {isSpeaking ? "Speaking" : "Listening"}
      </span>
      <span className="text-slate-800 font-bold text-sm">{name}</span>
    </div>
  );
}
