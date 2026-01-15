import { NextResponse } from "next/server";
import User from "@/models/User";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/db";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      name,
      email,
      phone,
      age,
      country,
      state,
      district,
      photo,
      aadhaarCard,
    } = body;

    // 1. Uploads (Optimized for mobile speed)
    let imageUrl = "";
    if (photo) {
      const uploadRes = await cloudinary.uploader.upload(photo, {
        folder: "dating_profiles",
      });
      imageUrl = uploadRes.secure_url;
    }

    let aadhaarUrl = "";
    if (aadhaarCard) {
      const uploadAadhaar = await cloudinary.uploader.upload(aadhaarCard, {
        folder: "user_verification",
      });
      aadhaarUrl = uploadAadhaar.secure_url;
    }

    // 2. Save User
    const newUser = await User.create({
      name,
      email,
      phone,
      age,
      country,
      state,
      district,
      photo: imageUrl,
      aadhaarCard: aadhaarUrl,
      isVerified: !!aadhaarUrl,
    });

    // 3. Generate Token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    }); // Long expiry for mobile

    // 4. Set Cookie (CRITICAL FOR MOBILE)
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only true in production
      sameSite: "lax", // Better for mobile redirects than "strict"
      maxAge: 60 * 60 * 24 * 30, // 30 Days - keeps them logged in even if they close browser
      path: "/",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
