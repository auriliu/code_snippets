import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
    select: false, // still visible in the db
  },
});

const userSchema_2 = new mongoose.Schema(
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // auto-manage createdAt and updatedAt
  }
);

UserSchema.pre("save", async function (next) {
  // only run if password was modified: prevents re-hashing the passwor
  if (!this.isModified("password")) return next();

  // hash the password with bcrypt
  this.password = await bcrypt.hash(this.password, 12);

  // set passwordChangedAt only if not a new user
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }

  next();
});

export default mongoose.model("User", UserSchema);
