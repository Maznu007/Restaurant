import mongoose from "mongoose";
import User from "../models/userSchema.js";
import { dbConnection } from "../database/dbConnection.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

const createAdmin = async () => {
  try {
    await dbConnection();

    const adminExists = await User.findOne({ email: "admin@yourdomain.com" });

    if (adminExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@yourdomain.com",
      phone: "1234567890",
      password: "admin1",
      role: "admin",
    });

    console.log("Admin user created successfully!");
    console.log("Email: admin@yourdomain.com");
    console.log("Password: admin1");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();