import { NextResponse } from "next/server";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get("userId");

    const query = currentUserId ? { _id: { $ne: currentUserId } } : {};

    // OPTIMIZATION: Select only what is needed for the card to reduce data size
    const realUsers = await User.find(query)
      .select("name age district photo voiceIntro isVerified")
      .sort({ lastActive: -1 }) // Make sure you have an index on lastActive in your Model
      .limit(12)
      .lean();

    const formattedUsers = realUsers.map((u: any) => ({
      id: u._id.toString(),
      name: u.name,
      age: u.age,
      dist: u.district || "Nearby",
      img:
        u.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`,
      voiceIntro: u.voiceIntro,
      isReal: true,
      isVerified: u.isVerified,
    }));

    return NextResponse.json({ users: formattedUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ users: [] }, { status: 500 });
  }
}
