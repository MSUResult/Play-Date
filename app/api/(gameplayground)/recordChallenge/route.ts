import { dbConnect } from "@/lib/db";
import Challenge from "@/models/challengeSchema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // For the list
    const challengeId = searchParams.get("challengeId"); // For the game

    // CASE 1: Fetching moves for a specific game (MatchGame.tsx)
    if (challengeId) {
      const challenge = await Challenge.findById(challengeId);
      return NextResponse.json(challenge);
    }

    // CASE 2: Fetching list for Activity Tab (No moves)
    if (userId) {
      const challenges = await Challenge.find({
        receiverId: userId,
        status: "pending",
      })
        .populate("challengerId", "name photo") // Only get name and photo
        .select("-challengerMoves -receiverMoves") // EXCLUDE the moves for speed
        .sort({ createdAt: -1 });

      return NextResponse.json(challenges);
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}


