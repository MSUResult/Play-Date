"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { determineWinner, Move } from "@/components/(mainGame)/gameLogic";
import { Loader2 } from "lucide-react";
import OpponentProfile from "@/components/(mainGame)/OpponentProfile";
import PlayerProfile from "@/components/(mainGame)/PlayerProfile";
import GameBoard from "@/components/(mainGame)/GameBoard";

export default function MatchGame() {
  const router = useRouter();
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const challengeId = searchParams.get("id");
  const { user } = useAuth();

  // STATE
  const [opponentSavedMoves, setOpponentSavedMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [playerMove, setPlayerMove] = useState<Move>(null);
  const [opponentMove, setOpponentMove] = useState<Move>(null);
  const [showResult, setShowResult] = useState(false);

  // REFS - Crucial for preventing the "Abort" bug
  const isFinishedRef = useRef(false);

  // 1. FETCH CHALLENGE DATA
  useEffect(() => {
    async function fetchChallengeData() {
      console.log("🛠️ FETCH: Starting fetch for challenge ID:", challengeId);
      try {
        const res = await fetch(`/api/challenge?id=${challengeId}`);
        const data = await res.json();

        if (data.challengerMoves) {
          console.log("✅ FETCH SUCCESS: Moves loaded", data.challengerMoves);
          setOpponentSavedMoves(data.challengerMoves);
        } else {
          console.warn("⚠️ FETCH WARNING: No moves found in response");
        }
      } catch (err) {
        console.error("❌ FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    }
    if (challengeId) fetchChallengeData();
  }, [challengeId]);

  // 2. ABORT LOGIC (Safety Guard)
  useEffect(() => {
    return () => {
      // Logic: If the component closes, but we never hit Round 4...
      if (!isFinishedRef.current && !loading && opponentSavedMoves.length > 0) {
        console.log(
          "🚨 ABORT DETECTED: Player left mid-game. Sending loss PATCH.",
        );

        fetch("/api/challenge", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            challengeId: challengeId,
            winnerId: slug, // Challenger wins because current user left
            finalScore: { player: 0, opponent: 4 },
          }),
          keepalive: true,
        });
      }
    };
  }, [loading, opponentSavedMoves, challengeId, slug]);

  // 3. COMPLETE CHALLENGE FUNCTION
  const completeChallenge = async (pScore: number, oScore: number) => {
    console.log(
      "🏁 FINISHING: Scores Finalized -> Player:",
      pScore,
      "Opponent:",
      oScore,
    );

    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    let winnerId = pScore > oScore ? user?._id : slug;
    if (pScore === oScore) winnerId = "DRAW";

    console.log("📡 PATCH: Sending final results to server...");

    try {
      await fetch("/api/challenge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: challengeId,
          winnerId: winnerId,
          finalScore: { player: pScore, opponent: oScore },
        }),
        keepalive: true,
      });
      console.log("✅ PATCH SUCCESS: Game recorded.");
    } catch (error) {
      console.error("❌ PATCH ERROR:", error);
    }

    router.push(
      `/result?wins=${pScore}&losses=${oScore}&status=${pScore > oScore ? "win" : "lose"}`,
    );
  };

  // 4. HANDLE MOVE LOGIC
  const handleMove = (move: Move) => {
    if (playerMove || showResult || loading) return;

    const oMove = opponentSavedMoves[round - 1];
    console.log(
      `🎮 ROUND ${round}: Player chose ${move}, Opponent chose ${oMove}`,
    );

    setPlayerMove(move);
    setOpponentMove(oMove);

    setTimeout(() => {
      setShowResult(true);
      const result = determineWinner(move, oMove);
      console.log(`⚖️ RESULT: Round ${round} was a ${result}`);

      let pScore = scores.player;
      let oScore = scores.opponent;
      if (result === "win") pScore++;
      if (result === "lose") oScore++;

      setScores({ player: pScore, opponent: oScore });

      setTimeout(() => {
        if (round >= 4) {
          console.log("🏆 MATCH OVER: Moving to completion logic.");
          completeChallenge(pScore, oScore);
        } else {
          console.log("⏭️ NEXT ROUND: Resetting board.");
          setRound((r) => r + 1);
          setPlayerMove(null);
          setOpponentMove(null);
          setShowResult(false);
        }
      }, 2000);
    }, 500);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#060908] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#060908] text-white flex flex-col p-6 items-center">
      <div className="bg-white/5 px-6 py-2 rounded-full border border-white/10 mb-8">
        <span className="text-emerald-400 font-black tracking-widest uppercase text-xs">
          Match Game Round {round} / 4
        </span>
      </div>

      <div className="flex justify-between items-center w-full max-w-md mb-12">
        <PlayerProfile name={user?.name || "You"} isMyTurn={true} />
        <div className="text-xl font-black italic text-white/10">VS</div>
        <OpponentProfile
          name={`Challenger`}
          avatar="/downloadm.png"
          micStatus="muted"
        />
      </div>

      <GameBoard
        playerMove={playerMove}
        opponentMove={opponentMove}
        showResult={showResult}
      />

      <div className="mt-auto mb-10 flex gap-4 w-full max-w-sm">
        {["ROCK", "PAPER", "SCISSORS"].map((m) => (
          <button
            key={m}
            onClick={() => handleMove(m as Move)}
            disabled={!!playerMove}
            className={`flex-1 aspect-[4/5] rounded-[32px] text-3xl border transition-all active:scale-95 ${
              playerMove === m
                ? "bg-emerald-500 border-emerald-400"
                : "bg-white/5 border-white/10"
            }`}
          >
            {m === "ROCK" ? "🪨" : m === "PAPER" ? "📄" : "✂️"}
          </button>
        ))}
      </div>
    </div>
  );
}
