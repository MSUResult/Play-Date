"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Heart, Swords, Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// --- HELPERS ---
const formatTime = (date: any) => {
  if (!date) return "now";
  const now = new Date().getTime();
  const past = new Date(date).getTime();
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// --- COMPONENTS ---

// New LikeCard Component
export function LikeCard({ lk }: { lk: any }) {
  return (
    <div className="bg-white p-4 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-sm border-l-4 border-l-pink-500">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 border border-pink-100">
          <Heart size={18} fill="currentColor" />
        </div>
        <div>
          <p className="font-black text-slate-800 text-sm">
            {lk.senderId?.name || "Someone"} liked you
          </p>
          <p className="text-[10px] text-pink-600 font-black uppercase italic tracking-tighter">
            Wants to challenge you!
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[9px] font-bold text-slate-300 uppercase">
          {formatTime(lk.createdAt)}
        </span>
      </div>
    </div>
  );
}
export function ChallengeCard({
  ch,
  onAccept,
}: {
  ch: any;
  onAccept: (id: string) => void;
}) {
  const router = useRouter();

  const handleAccept = () => {
    // Ensure we are grabbing the ID of the person who challenged us
    const challengerId = ch.challengerId?._id || ch.id;
    const documentId = ch._id || ch.id;
    onAccept(documentId);
    router.push(`/play/activeChallenge/${challengerId}?id=${documentId}`);
  };

  return (
    <div className="bg-white p-4 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
          <Flame size={18} />
        </div>
        <div>
          <p className="font-black text-slate-800 text-sm">
            {/* Display the Challenger's name */}
            {ch.challengerId?.name || "Someone"} challenged you
          </p>
          <p className="text-[10px] text-orange-600 font-black uppercase italic">
            {ch.task || "Rock Paper Scissors"}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[9px] font-bold text-slate-300 uppercase">
          {formatTime(ch.createdAt)}
        </span>
        <button
          onClick={handleAccept}
          className="bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg active:scale-95 shadow-md"
        >
          ACCEPT
        </button>
      </div>
    </div>
  );
}

export default function ActivityTab() {
  const [realChallenges, setRealChallenges] = useState<any[]>([]);
  const [realLikes, setRealLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchActivity = useCallback(async () => {
    if (!user?._id) return;
    try {
      const [resPending, resLikes] = await Promise.all([
        fetch(
          `/api/challenge?userId=${user._id}&status=pending&t=${Date.now()}`,
        ),
        fetch(`/api/received?userId=${user._id}&t=${Date.now()}`),
      ]);

      const pendingData = await resPending.json();
      const likesData = await resLikes.json();

      if (Array.isArray(pendingData)) {
        // Double check: Filter out any challenge where I am the challenger
        const onlyIncoming = pendingData.filter(
          (ch) => (ch.challengerId?._id || ch.challengerId) !== user._id,
        );
        setRealChallenges(onlyIncoming);
      }

      if (Array.isArray(likesData)) setRealLikes(likesData);
    } catch (err) {
      console.error("Error fetching activity");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const handleFastRemove = (id: string) => {
    setRealChallenges((prev) =>
      prev.filter((item) => (item._id || item.id) !== id),
    );
  };

  if (loading)
    return (
      <div className="p-10 text-center animate-pulse text-slate-300 font-black italic">
        FETCHING...
      </div>
    );

  return (
    <div className="space-y-8">
      {/* LIKES SECTION */}
      {realLikes.length > 0 && (
        <div>
          <h3 className="text-[10px] font-black text-slate-400 flex items-center gap-2 tracking-[0.2em] uppercase mb-4">
            <Heart size={12} className="text-pink-500" fill="currentColor" />{" "}
            New Likes
          </h3>
          <div className="space-y-3">
            {realLikes.map((lk: any) => (
              <LikeCard key={lk._id} lk={lk} />
            ))}
          </div>
        </div>
      )}

      {/* CHALLENGES SECTION */}
      <div>
        <h3 className="text-[10px] font-black text-slate-400 flex items-center gap-2 tracking-[0.2em] uppercase mb-4">
          <Swords size={12} className="text-orange-500" /> Pending Challenges
        </h3>
        <div className="space-y-3">
          {realChallenges.length === 0 && realLikes.length === 0 ? (
            <p className="text-xs text-slate-300 italic font-bold p-4">
              No new activity
            </p>
          ) : (
            realChallenges.map((ch: any) => (
              <ChallengeCard key={ch._id} ch={ch} onAccept={handleFastRemove} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
