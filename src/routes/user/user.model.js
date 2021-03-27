import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    last_name: {
      type: String,
      required: false,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    nationality: {
      type: String,
      required: false,
      trim: true,
    },
    gender: {
      type: String,
      required: false,
      enum: ["male", "female", "other"],
    },
    roll_number: {
      type: Number,
      required: false,
      unique: true,
      maxlength: 11,
    },
    uid: {
      required: true,
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("user", userSchema);
