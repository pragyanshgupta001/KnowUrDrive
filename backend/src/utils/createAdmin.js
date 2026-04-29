import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

const createAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ role: "ADMIN" });
  if (existing) {
    console.log("Admin already exists:", existing.email);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("admin@123", 10);

  const admin = await User.create({
    name:       "Super Admin",
    email:      "admin@knowurdrive.com",
    password:   hashedPassword,
    role:       "ADMIN",
    isVerified: true,
    isActive:   true,
  });

  console.log("Admin created successfully:");
  console.log("  Email:   ", admin.email);
  console.log("  Password: admin@123");
  console.log("  Role:    ", admin.role);
  process.exit(0);
};

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});