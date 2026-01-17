"use client";
import React, { useEffect, useState } from "react";
import { MapPin, Swords, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
];

const ActiveChallengers = ({
  setLikeCount,
}: {
  setLikeCount: (n: number) => void;
}) => {
  const { user } = useAuth();
  const [realPlayers, setRealPlayers] = useState([]);
  const [likedPlayers, setLikedPlayers] = useState<
    Record<string | number, boolean>
  >({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      try {
        // 1. Fetch Players
        const res = await fetch(`/api/players?userId=${user?._id}`);
        const data = await res.json();
        setRealPlayers(data.users || []);

        // 2. Fetch MY LIKES (To keep hearts red on cards)
        const myLikesRes = await fetch(
          `/api/social/my-likes?userId=${user._id}`,
        );
        const myLikesData = await myLikesRes.json();
        const likesMap: Record<string, boolean> = {};
        myLikesData.likedIds?.forEach((id: string) => {
          likesMap[id] = true;
        });
        setLikedPlayers(likesMap);

        // 3. Fetch RECEIVED LIKES COUNT (For the Header in Discover)
        // Use the exact route you provided for counting received likes
        const receivedRes = await fetch(
          `/api/social/received-likes-count?userId=${user._id}`,
        );
        const receivedData = await receivedRes.json();
        setLikeCount(receivedData.count || 0);
      } catch (err) {
        console.error("Init error:", err);
      }
    };

    fetchData();
  }, [user?._id, setLikeCount]);

  const toggleLike = async (receiverId: string | number) => {
    if (!user) {
      toast.error("Login Required");
      return;
    }

    const isCurrentlyLiked = likedPlayers[receiverId];

    // Optimistic UI: Update heart immediately so it stays/removes visually
    setLikedPlayers((prev) => ({ ...prev, [receiverId]: !isCurrentlyLiked }));

    try {
      const res = await fetch("/api/social/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: user._id, receiverId }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();

      // Ensure state matches the server response
      setLikedPlayers((prev) => ({ ...prev, [receiverId]: data.isLiked }));
    } catch (err) {
      // Revert if API fails
      setLikedPlayers((prev) => ({ ...prev, [receiverId]: isCurrentlyLiked }));
      toast.error("Failed to update like");
    }
  };

  const allPlayers = [...realPlayers, ...DUMMY_PLAYERS];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {allPlayers.map((player) => {
        const playerId = player._id || player.id;
        const isLiked = likedPlayers[playerId];

        return (
          <div key={playerId} className="flex flex-col gap-3 group">
            <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden shadow-lg border-2 border-white bg-white hover:shadow-2xl transition-all duration-300">
              <img
                src={player.photo || player.img}
                alt={player.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              <button
                onClick={() => toggleLike(playerId)}
                className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 z-10"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${isLiked ? "text-pink-500 fill-pink-500" : "text-white"}`}
                />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="text-white font-bold">
                  {player.name}, {player.age}
                </h3>
                <div className="flex items-center gap-1 text-white/80 text-xs">
                  <MapPin className="w-3 h-3 text-pink-500" />
                  {player.district || player.dist}
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                user
                  ? router.push(`/play/record/${playerId}`)
                  : toast.error("Login required")
              }
              className="w-full py-3 bg-slate-900 hover:bg-pink-600 text-white rounded-2xl flex items-center justify-center gap-2 transition-all"
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
