import { NextResponse } from "next/server";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Sort by lastActive: -1 means "Newest First"

    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get("userId");

    const query = currentUserId ? { _id: { $ne: currentUserId } } : {};

    const realUsers = await User.find(query)
      .select("name age district photo lastActive isVerified")
      .sort({ lastActive: -1 })
      .limit(20)
      .lean();

    const formattedUsers = realUsers.map((u: any) => ({
      id: u._id.toString(),
      name: u.name,
      age: u.age,
      dist: u.district || "Nearby",
      img:
        u.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`,
      isReal: true,
      lastActive: u.lastActive,
      isVerified: u.isVerified,
    }));

    return NextResponse.json({ users: formattedUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ users: [] }, { status: 500 });
  }
}
