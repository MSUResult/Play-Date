"use client";
import React, { useEffect, useState, useMemo } from "react";
import { MapPin, Swords, Heart, Play, Volume2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DUMMY_PLAYERS = [
  {
    id: "dummy1",
    name: "Maya",
    age: 24,
    dist: "2km",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
  },
];

const ActiveChallengers = ({
  setLikeCount,
}: {
  setLikeCount: (n: number) => void;
}) => {
  const { user } = useAuth();
  const [realPlayers, setRealPlayers] = useState([]);
  const [likedPlayers, setLikedPlayers] = useState<Record<string, boolean>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      try {
        // Optimized parallel fetching
        const [playersRes, likesRes, countRes] = await Promise.all([
          fetch(`/api/players?userId=${user?._id}`),
          fetch(`/api/social/my-likes?userId=${user._id}`),
          fetch(`/api/social/received-likes-count?userId=${user._id}`),
        ]);

        const playersData = await playersRes.json();
        const likesData = await likesRes.json();
        const countData = await countRes.json();

        setRealPlayers(playersData.users || []);
        setLikeCount(countData.count || 0);

        const likesMap: Record<string, boolean> = {};
        likesData.likedIds?.forEach((id: string) => {
          likesMap[id] = true;
        });
        setLikedPlayers(likesMap);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [user?._id, setLikeCount]);

  const playVoice = (url: string, id: string) => {
    if (playingId === id) return;
    setPlayingId(id);
    const audio = new Audio(url);
    audio.preload = "none"; // Optimization: Don't load audio until requested
    audio.play();
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => {
      toast.error("Voice clip failed");
      setPlayingId(null);
    };
  };

  const toggleLike = async (receiverId: string) => {
    if (!user) return toast.error("Login Required");
    const isCurrentlyLiked = likedPlayers[receiverId];
    setLikedPlayers((prev) => ({ ...prev, [receiverId]: !isCurrentlyLiked }));
    try {
      const res = await fetch("/api/social/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: user._id, receiverId }),
      });
      if (!res.ok) throw new Error();
    } catch (err) {
      setLikedPlayers((prev) => ({ ...prev, [receiverId]: isCurrentlyLiked }));
      toast.error("Failed to update like");
    }
  };

  const allPlayers = useMemo(
    () => [...realPlayers, ...DUMMY_PLAYERS],
    [realPlayers],
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {allPlayers.map((player) => {
        const playerId = player.id || player._id;
        const isLiked = likedPlayers[playerId];

        // OPTIMIZATION: Cloudinary dynamic resizing for fast loading
        const optimizedImg = player.img.includes("cloudinary")
          ? player.img.replace(
              "/upload/",
              "/upload/w_400,c_fill,g_faces,q_auto,f_auto/",
            )
          : player.img;

        return (
          <div key={playerId} className="flex flex-col gap-3 group">
            <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden shadow-lg border-2 border-white bg-slate-100 hover:shadow-2xl transition-all duration-300">
              <img
                src={optimizedImg}
                alt={player.name}
                loading="lazy" // Browsers will prioritize loading images near the top
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <button
                onClick={() => toggleLike(playerId)}
                className="absolute top-3 right-3 p-2 bg-black/30 backdrop-blur-md rounded-full border border-white/20 z-10 active:scale-90"
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? "text-pink-500 fill-pink-500" : "text-white"}`}
                />
              </button>

              {player.voiceIntro && (
                <button
                  onClick={() => playVoice(player.voiceIntro, playerId)}
                  className={`absolute bottom-16 right-3 p-3 rounded-2xl border border-white/20 backdrop-blur-xl transition-all z-10 active:scale-90 shadow-xl ${
                    playingId === playerId
                      ? "bg-pink-500 text-white"
                      : "bg-black/20 text-white"
                  }`}
                >
                  {playingId === playerId ? (
                    <Volume2 size={18} className="animate-pulse" />
                  ) : (
                    <Play size={18} fill="currentColor" />
                  )}
                </button>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="text-white font-bold">
                  {player.name}, {player.age}
                </h3>
                <div className="flex items-center gap-1 text-white/80 text-xs font-medium">
                  <MapPin className="w-3 h-3 text-pink-500" />
                  {player.dist}
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                user
                  ? router.push(`/play/record/${playerId}`)
                  : toast.error("Login required")
              }
              className="w-full py-3 bg-slate-900 hover:bg-pink-600 text-white rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Swords className="w-4 h-4 text-[#00FFAB]" />
              <span className="text-xs font-black uppercase tracking-widest">
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
