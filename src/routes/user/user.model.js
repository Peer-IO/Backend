import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    password: {
      type: String,
      required: true,
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
      required: true,
      enum: ["male", "female", "other"],
    },
    roll_number: {
      type: Number,
      required: false,
      unique: true,
      maxlength: 11,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (docs, next) {
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

export const User = mongoose.model("user", userSchema);
