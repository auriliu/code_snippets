import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;

export const MONGODB_USER = process.env.MONGODB_USER || "";
export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || "";
export const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER || "";

export const JWT_SECRET = process.env.JWT_SECRET || "";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "90d";

// alternative values so it doesnt crash, otherwise undefined ll crash your app.
