import mongoose, { Schema, model, models } from "mongoose";

const ChallengeSchema = new Schema({
  challengerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },

  // Array of 4 moves: ["ROCK", "PAPER", ...]
  challengerMoves: { type: [String], required: true },
  receiverMoves: { type: [String], default: [] },

  status: { type: String, enum: ["pending", "completed"], default: "pending" },

  // Results summary (kept for 24 hours)
  result: {
    winnerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    finalScore: { player: Number, opponent: Number },
  },

  // Auto-delete after 24 hours (86400 seconds)
  createdAt: { type: Date, default: Date.now, expires: 86400 },
});

const Challenge = models.Challenge || model("Challenge", ChallengeSchema);
export default Challenge;
