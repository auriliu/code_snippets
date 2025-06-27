import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minlength: [2, "name must be at least 2 characters"],
      maxlength: [50, "name must be at most 50 characters"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "password must be at least 8 characters"],
      select: false, // exclude password by default
    },
    // confirmedPassword is a virtual field, not saved in DB:
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // auto-manage createdAt and updatedAt
  }
);

export default mongoose.model("User", UserSchema);
