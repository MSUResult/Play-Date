export type Player = "X" | "O";
export type SquareValue = Player | null;

export const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Cols
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

export function calculateWinner(squares: SquareValue[]): Player | null {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export function isBoardFull(squares: SquareValue[]): boolean {
  return squares.every((square) => square !== null);
}

export function getBestMove(squares: SquareValue[]): number {
  const emptyIndices = squares
    .map((val, idx) => (val === null ? idx : -1))
    .filter((idx) => idx !== -1);

  if (emptyIndices.length === 0) return -1;
  const randomIndex = Math.floor(Math.random() * emptyIndices.length);
  return emptyIndices[randomIndex];
}
