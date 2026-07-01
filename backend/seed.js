/**
 * SEED SCRIPT — Run once to create the first TPO Admin account
 *
 * Usage:
 *   cd backend
 *   node seed.js
 *
 * FILL the values below before running.
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "config/config.env") });

// ── FILL THESE BEFORE RUNNING ──────────────────────────────────────────────
const TPO_EMAIL    = "erudite@gmail.com";         // e.g. tpo@nitdelhi.ac.in
const TPO_PASSWORD = "eruditeyash";      // min 8 characters
// ───────────────────────────────────────────────────────────────────────────

const run = async () => {
  if (TPO_EMAIL.includes("YASH_GUPTA") || TPO_PASSWORD.includes("YASH_GUPTA")) {
    console.error("❌ Please fill TPO_EMAIL and TPO_PASSWORD in seed.js before running.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, { dbName: "NIT_DELHI_PLACEMENT_PORTAL" });
  console.log("✅ Connected to MongoDB");

  const { User } = await import("./models/User.js");

  const existing = await User.findOne({ email: TPO_EMAIL.toLowerCase() });
  if (existing) {
    console.log("⚠  TPO account already exists:", TPO_EMAIL);
    process.exit(0);
  }

  const user = await User.create({
    email: TPO_EMAIL.toLowerCase(),
    password: TPO_PASSWORD,
    role: "TPO",
  });

  console.log("✅ TPO Admin created successfully!");
  console.log("   Email   :", user.email);
  console.log("   Role    :", user.role);
  console.log("   Login at: http://localhost:5174/login");
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
