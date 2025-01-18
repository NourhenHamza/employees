import mongoose from "mongoose";
import User from "./models/userSchema.js"; // Adjust the path to your User model

const createUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/JOB_PORTAL_WITH_AUTOMATION", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check for and delete duplicate users
    const existingAlignedUser = await User.findOne({ email: "aligneduser@example.com" });
    if (existingAlignedUser) {
      console.log("Deleting existing Aligned User...");
      await User.deleteOne({ email: "aligneduser@example.com" });
    }

    const existingNonAlignedUser = await User.findOne({ email: "nonaligneduser@example.com" });
    if (existingNonAlignedUser) {
      console.log("Deleting existing Non-Aligned User...");
      await User.deleteOne({ email: "nonaligneduser@example.com" });
    }

    // Create a user that aligns with the project
    const alignedUser = await User.create({
      name: "Aligned User",
      role: "Job Seeker",
      email: "aligneduser@example.com",
      password: "password123",
      phone: "1234567890",
      address: "123 Align St",
      skills: [
        { name: "JavaScript", score: 90}, // Higher than required (50)
        { name: "React", score: 95}, // Higher than required (60)
      ],
    });

    // Create a user that doesn't align with the project
    const nonAlignedUser = await User.create({
      name: "Non-Aligned User",
      role: "Job Seeker",
      email: "nonaligneduser@example.com",
      password: "password123",
      phone: "9876543210",
      address: "456 Non-Align St",
      skills: [
        { name: "JavaScript", score: 40 }, // Lower than required (50)
        { name: "React", score: 50 }, // Lower than required (60)
      ],
    });

    console.log("Users created successfully:");
    console.log("Aligned User:", alignedUser);
    console.log("Non-Aligned User:", nonAlignedUser);

    process.exit(0);
  } catch (error) {
    console.error("Error creating users:", error);
    process.exit(1);
  }
};

createUsers();
