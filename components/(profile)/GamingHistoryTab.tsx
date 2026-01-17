"use client";
import { Gamepad2, User } from "lucide-react";

export function HistoryItem({
  game,
  isLast,
  currentUserId,
}: {
  game: any;
  isLast: boolean;
  currentUserId: string;
}) {
  // Determine if the player won or lost based on winnerId in DB
  const isWinner = game.result?.winnerId === currentUserId;
  const resultText =
    game.result?.winnerId === "DRAW" ? "DRAW" : isWinner ? "WON" : "LOST";

  return (
    <div
      className={`p-4 flex items-center justify-between ${!isLast ? "border-b border-slate-50" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
          {game.challengerId?.photo ? (
            <img
              src={game.challengerId.photo}
              alt="user"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={16} className="text-slate-400" />
          )}
        </div>
        <div>
          <p className="font-black text-slate-800 text-sm">
            {game.challengerId?.name || "Opponent"}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">
            {game.task || "Rock Paper Scissors"} •{" "}
            {new Date(game.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-slate-400">
          {game.result?.finalScore?.player}-{game.result?.finalScore?.opponent}
        </span>
        <div
          className={`text-[10px] font-black px-3 py-1 rounded-full ${
            resultText === "WON"
              ? "bg-emerald-50 text-emerald-600"
              : resultText === "DRAW"
                ? "bg-orange-50 text-orange-600"
                : "bg-pink-50 text-pink-600"
          }`}
        >
          {resultText}
        </div>
      </div>
    </div>
  );
}

export default function GamingHistoryTab({
  history,
  currentUserId,
}: {
  history: any[];
  currentUserId: string;
}) {
  if (!history || history.length === 0) {
    return (
      <div className="p-10 text-center text-slate-300 font-bold italic text-sm">
        NO MATCH RECORDS YET
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-slate-400 flex items-center gap-2 tracking-[0.2em] uppercase mb-4">
        <Gamepad2 size={12} className="text-blue-500" /> Match Records
      </h3>
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        {history.map((game, idx) => (
          <HistoryItem
            // FIX: Use game._id, then fallback to game.id, then fallback to the index (idx)
            key={game._id || game.id || `history-${idx}`}
            game={game}
            currentUserId={currentUserId}
            isLast={idx === history.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
