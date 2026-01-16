import { NextResponse } from "next/server";
import SocialAction from "@/models/SocialAction"; // The schema we discussed
import { dbConnect } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: "Missing IDs" }, { status: 400 });
    }

    // Toggle logic: If like exists, remove it. If not, create it.
    const existingLike = await SocialAction.findOne({
      senderId,
      receiverId,
      type: "LIKE",
    });

    if (existingLike) {
      await SocialAction.deleteOne({ _id: existingLike._id });
      return NextResponse.json({ isLiked: false, message: "Unliked" });
    }

    await SocialAction.create({
      senderId,
      receiverId,
      type: "LIKE",
    });

    return NextResponse.json({ isLiked: true, message: "Liked" });
  } catch (error) {
    console.error("Like Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
