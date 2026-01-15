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

    // 1. Upload Profile Photo
    let imageUrl = "";
    if (photo) {
      const uploadRes = await cloudinary.uploader.upload(photo, {
        folder: "dating_profiles",
      });
      imageUrl = uploadRes.secure_url;
    }

    // 2. Upload Aadhaar Card (If provided)
    let aadhaarUrl = "";
    if (aadhaarCard) {
      const uploadAadhaar = await cloudinary.uploader.upload(aadhaarCard, {
        folder: "user_verification",
      });
      aadhaarUrl = uploadAadhaar.secure_url;
    }

    // 3. Create User
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
      isVerified: !!aadhaarUrl, // Auto-verify if they upload Aadhaar
    });

    // 4. Auth Token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
