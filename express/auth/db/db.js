import mongoose from "mongoose";
import {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_CLUSTER,
} from "../config/config.js";

const url = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`;

export default async function connectDB() {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
  }
}
