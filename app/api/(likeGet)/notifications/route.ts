import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import SocialAction from "@/models/SocialAction";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const myId = decoded.userId;

    await dbConnect();

    // Fetch real likes and include the timestamp (createdAt)
    const realLikes = await SocialAction.find({
      receiverId: myId,
      type: "LIKE",
    })
      .populate("senderId", "name photo")
      .sort({ createdAt: -1 })
      .lean();

    const formattedRealLikes = realLikes.map((l: any) => ({
      id: l._id.toString(),
      name: l.senderId?.name || "Unknown User",
      photo: l.senderId?.photo || null,
      msg: "Liked your profile!",
      time: l.createdAt, // Sending raw date to frontend
      isDummy: false,
    }));

    // We send empty challenges if none exist in DB
    // Dummy data is now handled purely in the Frontend
    return NextResponse.json({
      likes: formattedRealLikes,
      challenges: [],
    });
  } catch (error: any) {
    console.error("Notification Error:", error.message);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
