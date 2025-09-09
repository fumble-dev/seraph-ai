import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      default: 20,
    },
  },
  { timestamps: true } 
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
