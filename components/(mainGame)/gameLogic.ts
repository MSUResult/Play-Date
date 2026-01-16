export type Move = "ROCK" | "PAPER" | "SCISSORS" | null;

export const MOVES: { id: Move; beats: Move }[] = [
  { id: "ROCK", beats: "SCISSORS" },
  { id: "PAPER", beats: "ROCK" },
  { id: "SCISSORS", beats: "PAPER" },
];

export function getComputerMove(): Move {
  const randomIndex = Math.floor(Math.random() * MOVES.length);
  return MOVES[randomIndex].id;
}

export function determineWinner(
  player: Move,
  opponent: Move
): "win" | "lose" | "draw" {
  if (player === opponent) return "draw";
  const moveDetail = MOVES.find((m) => m.id === player);
  return moveDetail?.beats === opponent ? "win" : "lose";
}
