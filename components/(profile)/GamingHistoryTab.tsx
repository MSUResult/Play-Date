import { Gamepad2, User } from "lucide-react";

export function HistoryItem({ game, isLast }: { game: any; isLast: boolean }) {
  return (
    <div
      className={`p-4 flex items-center justify-between ${
        !isLast ? "border-b border-slate-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
          <User size={16} className="text-slate-400" />
        </div>
        <div>
          <p className="font-black text-slate-800 text-sm">{game.opponent}</p>
          <p className="text-[10px] text-slate-400 font-bold">
            {game.game} • {game.date}
          </p>
        </div>
      </div>
      <div
        className={`text-[10px] font-black px-3 py-1 rounded-full ${
          game.result === "WON"
            ? "bg-emerald-50 text-emerald-600"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {game.result}
      </div>
    </div>
  );
}

export default function GamingHistoryTab({ history }: { history: any[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-slate-400 flex items-center gap-2 tracking-[0.2em] uppercase mb-4">
        <Gamepad2 size={12} className="text-blue-500" /> Match Records
      </h3>
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        {history.map((game, idx) => (
          <HistoryItem
            key={game.id}
            game={game}
            isLast={idx === history.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
