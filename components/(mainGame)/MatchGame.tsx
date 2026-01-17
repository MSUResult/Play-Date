// "use client";
// import { useState, useEffect } from "react";
// import { useRouter, useParams, useSearchParams } from "next/navigation";
// import { useAuth } from "@/context/AuthContext"; // Use your Auth
// import { determineWinner, Move } from "../../gameLogic";
// import GameBoard from "../../GameBoard";
// import PlayerProfile from "../../PlayerProfile";
// import OpponentProfile from "../../OpponentProfile";
// import { Loader2 } from "lucide-react";

// export default function MatchGame() {
//   const router = useRouter();
//   const { slug } = useParams(); // Challenger ID
//   const searchParams = useSearchParams();
//   const challengeId = searchParams.get("id");
//   const { user } = useAuth(); // Your ID

//   const [opponentSavedMoves, setOpponentSavedMoves] = useState<Move[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [round, setRound] = useState(1);
//   const [scores, setScores] = useState({ player: 0, opponent: 0 });
//   const [playerMove, setPlayerMove] = useState<Move>(null);
//   const [opponentMove, setOpponentMove] = useState<Move>(null);
//   const [showResult, setShowResult] = useState(false);

//   // 1. Fetch the recorded moves on load
//   useEffect(() => {
//     async function fetchChallengeData() {
//       try {
//         const res = await fetch(`/api/challenge?id=${challengeId}`);
//         const data = await res.json();
//         // Assuming your API returns { challengerMoves: ["ROCK", ...] }
//         setOpponentSavedMoves(data.challengerMoves);
//       } catch (err) {
//         console.error("Error loading challenge");
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (challengeId) fetchChallengeData();
//   }, [challengeId]);

//   const completeChallenge = async (pScore: number, oScore: number) => {
//     let winnerId = pScore > oScore ? user?._id : slug;
//     if (pScore === oScore) winnerId = "DRAW";

//     await fetch("/api/challenge", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         challengeId: challengeId,
//         winnerId: winnerId,
//         finalScore: { player: pScore, opponent: oScore },
//       }),
//     });

//     router.push(
//       `/result?wins=${pScore}&losses=${oScore}&status=${pScore > oScore ? "win" : "lose"}`,
//     );
//   };

//   const handleMove = (move: Move) => {
//     if (playerMove || showResult || loading) return;

//     const oMove = opponentSavedMoves[round - 1];
//     setPlayerMove(move);
//     setOpponentMove(oMove);

//     setTimeout(() => {
//       setShowResult(true);
//       const result = determineWinner(move, oMove);

//       let pScore = scores.player;
//       let oScore = scores.opponent;
//       if (result === "win") pScore++;
//       if (result === "lose") oScore++;
//       setScores({ player: pScore, opponent: oScore });

//       setTimeout(() => {
//         if (round >= 4) {
//           completeChallenge(pScore, oScore);
//         } else {
//           setRound((r) => r + 1);
//           setPlayerMove(null);
//           setOpponentMove(null);
//           setShowResult(false);
//         }
//       }, 2000);
//     }, 500);
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen bg-[#060908] flex items-center justify-center">
//         <Loader2 className="animate-spin text-emerald-500" size={40} />
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#060908] text-white flex flex-col p-6 items-center">
//       {/* ... Your existing UI components (Header, VS, Profiles, GameBoard) ... */}
//       <div className="bg-white/5 px-6 py-2 rounded-full border border-white/10 mb-8">
//         <span className="text-emerald-400 font-black tracking-widest uppercase">
//           Match Game Round {round} / 4
//         </span>
//       </div>

//       <div className="flex justify-between items-center w-full max-w-md mb-12">
//         <PlayerProfile name={user?.name} isMyTurn={true} />
//         <div className="text-xl font-black italic text-white/10">VS</div>
//         <OpponentProfile
//           name={`Player_${slug.toString().slice(0, 4)}`}
//           avatar="/downloadm.png"
//           micStatus="muted"
//         />
//       </div>

//       <GameBoard
//         playerMove={playerMove}
//         opponentMove={opponentMove}
//         showResult={showResult}
//       />

//       <div className="mt-auto mb-10 flex gap-4 w-full max-w-sm">
//         {["ROCK", "PAPER", "SCISSORS"].map((m) => (
//           <button
//             key={m}
//             onClick={() => handleMove(m as Move)}
//             disabled={!!playerMove}
//             className={`flex-1 aspect-[4/5] rounded-[32px] text-3xl border transition-all active:scale-90 ${
//               playerMove === m
//                 ? "bg-emerald-500 border-emerald-400"
//                 : "bg-white/5 border-white/10"
//             }`}
//           >
//             {m === "ROCK" ? "🪨" : m === "PAPER" ? "📄" : "✂️"}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
