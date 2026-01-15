import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  age: { type: Number, required: true },
  country: { type: String, required: true },
  district: { type: String, required: true },
  photo: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// This line is critical for Next.js
const User = models.User || model("User", UserSchema);
export default User;
