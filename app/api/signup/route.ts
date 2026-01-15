import { NextResponse } from "next/server";
import User from "@/models/User";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/db";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const startTime = Date.now();
  console.log("🚀 [SIGNUP START] Processing new request...");

  try {
    // 1. Connect to Database
    console.time("⏱️ DB_Connection");
    await dbConnect();
    console.timeEnd("⏱️ DB_Connection");

    const body = await req.json();
    const { name, email, phone, age, country, district, photo } = body;
    console.log(`📝 Data Received: ${name} (${email})`);

    // 2. Upload to Cloudinary
    let imageUrl = "";
    if (photo) {
      console.time("⏱️ Cloudinary_Upload");
      const uploadRes = await cloudinary.uploader.upload(photo, {
        folder: "dating_app_profiles",
      });
      imageUrl = uploadRes.secure_url;
      console.timeEnd("⏱️ Cloudinary_Upload");
      console.log("📸 Image Uploaded:", imageUrl);
    }

    // 3. Save to MongoDB
    console.time("⏱️ Mongo_Create");
    // Explicitly check if User exists to debug import issues
    if (!User || typeof User.create !== "function") {
      throw new Error(
        "User Model is not initialized correctly. Check models/User.ts"
      );
    }

    const newUser = await User.create({
      name,
      email,
      phone,
      age,
      country,
      district,
      photo: imageUrl,
    });
    console.timeEnd("⏱️ Mongo_Create");
    console.log("💾 User saved to DB with ID:", newUser._id);

    // 4. Generate Token
    console.time("⏱️ JWT_Generation");
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    console.timeEnd("⏱️ JWT_Generation");

    // 5. Set Cookie
    console.time("⏱️ Set_Cookie");
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    console.timeEnd("⏱️ Set_Cookie");

    const duration = Date.now() - startTime;
    console.log(`✅ [SIGNUP SUCCESS] Total Request Time: ${duration}ms`);

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error("❌ [SIGNUP ERROR]:", error.message);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
