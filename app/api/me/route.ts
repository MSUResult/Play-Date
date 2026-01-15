import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import User from "@/models/User";
import { dbConnect } from "@/lib/db";

export async function GET() {
  const start = Date.now();
  console.log("🔍 API/ME: Request received");

  try {
    // 1. Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("ℹ️ API/ME: No token found in cookies.");
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // 2. Verify JWT
    console.time("⏱️ JWT_Verify");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    console.timeEnd("⏱️ JWT_Verify");

    // 3. Get User from Database
    await dbConnect();
    console.time("⏱️ DB_Fetch_User");
    const user = await User.findById(decoded.userId).select("-password"); // Don't send password to frontend
    console.timeEnd("⏱️ DB_Fetch_User");

    if (!user) {
      console.log("❌ API/ME: Token valid but user not found in DB.");
      return NextResponse.json({ user: null }, { status: 200 });
    }

    console.log(`✅ API/ME: Success (${Date.now() - start}ms)`);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("❌ API/ME: Auth Error", error);
    // If token is expired or fake, return null so frontend can redirect to signup
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
