import { dbConnect } from "@/lib/db";
import Challenge from "@/models/challengeSchema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const challengeId = searchParams.get("challengeId");
    // Default to pending if no status is provided
    const status = searchParams.get("status") || "pending";

    if (challengeId) {
      const challenge = await Challenge.findById(challengeId);
      return NextResponse.json(challenge);
    }

    if (userId) {
      const challenges = await Challenge.find({
        receiverId: userId,
        status: status, // Now filters based on what tab needs it
      })
        .populate("challengerId", "name photo")
        .select("-challengerMoves -receiverMoves")
        .sort({ updatedAt: -1 }); // Show newest results first

      return NextResponse.json(challenges);
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
