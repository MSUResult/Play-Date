import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  age: { type: Number, required: true },
  country: { type: String, required: true, default: "India" },
  state: { type: String, required: true }, // Added State
  district: { type: String }, // Optional
  city: { type: String },
  photo: { type: String },
  aadhaarCard: { type: String }, // Optional Aadhaar URL
  voiceIntro: { type: String },
  bio: { type: String, default: "Hey! Let's play." },
  isVerified: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const User = models.User || model("User", UserSchema);
export default User;
