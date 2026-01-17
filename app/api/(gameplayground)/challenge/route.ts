import { dbConnect } from "@/lib/db";
import Challenge from "@/models/challengeSchema";
import { NextResponse } from "next/server";

// 1. GET: Fetching data for Activity Tab or Match Game
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const challengeId = searchParams.get("id"); // Match the frontend 'id'
    const status = searchParams.get("status") || "pending";

    // Case 1: Fetching moves for a specific match
    if (challengeId) {
      console.log("Fetching Match for ID:", challengeId);
      const challenge = await Challenge.findById(challengeId).populate(
        "challengerId",
        "name photo",
      );
      return NextResponse.json(challenge);
    }

    // Case 2: Fetching list for Activity Tab or History
    if (userId) {
      console.log("Fetching List for User:", userId, "Status:", status);
      // FIX: Look for challenges where user is EITHER receiver OR challenger
      const challenges = await Challenge.find({
        receiverId: userId,
        status: status,
      })
        .populate("challengerId", "name photo")
        .populate("receiverId", "name photo") // Also populate receiver
        .select("-challengerMoves -receiverMoves")
        .sort({ updatedAt: -1 });
      return NextResponse.json(challenges);
    }

    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// 2. POST: Saving the moves when you record a game
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    console.log("LOG: POST Data Received (Saving Challenge):", body);

    const { challengerId, receiverId, moves } = body;

    const newChallenge = await Challenge.create({
      challengerId,
      receiverId,
      challengerMoves: moves,
      status: "pending",
    });

    console.log("LOG: Challenge Created ID:", newChallenge._id);

    return NextResponse.json(
      { success: true, id: newChallenge._id },
      { status: 201 },
    );
  } catch (error) {
    console.error("LOG: POST Error", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

// 3. PATCH: Completing the game and wiping moves
export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    console.log("LOG: PATCH Data Received (Finishing Game):", body);

    const { challengeId, winnerId, finalScore } = body;

    const updatedChallenge = await Challenge.findByIdAndUpdate(
      challengeId,
      {
        $set: {
          status: "completed",
          result: { winnerId, finalScore },
        },
        $unset: { challengerMoves: "", receiverMoves: "" },
      },
      { new: true },
    );

    console.log("LOG: Game Completed Successfully");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LOG: PATCH Error", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
