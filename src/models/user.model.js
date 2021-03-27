import mongoose from "mongoose";
import { crudControllers } from "../services/crud";

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
      immutable: true,
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
      maxlength: 11,
    },
    uid: {
      required: true,
      type: String,
      unique: true,
      immutable: true,
    },
    email_verified: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  versionKey: false,
});

export const User = mongoose.model("user", userSchema);

export default crudControllers(User);
