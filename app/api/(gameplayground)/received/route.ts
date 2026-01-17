import { NextResponse } from "next/server";
import SocialAction from "@/models/SocialAction";
import User from "@/models/User"; // <--- ADD THIS IMPORT so populate works
import { dbConnect } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json([]);

    // We search for likes where the logged-in user is the receiver
    const likes = await SocialAction.find({
      receiverId: userId,
      type: "LIKE",
    })
      .populate("senderId", "name photo") // Populates the person who liked you
      .sort({ createdAt: -1 });

    return NextResponse.json(likes);
  } catch (error: any) {
    console.error("API ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
