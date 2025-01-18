import mongoose from "mongoose";
import Project from "./models/projectSchema.js"; // Adjust the path if necessary
import User from "./models/userSchema.js"; // Adjust the path if necessary

const createProject = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/JOB_PORTAL_WITH_AUTOMATION", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });



    // Create a project using the mock user's ObjectId
    const project = await Project.create({
      name: "helloooo",
      skillsRequired: [
        { name: "JavaScript", minCompetence: 70, weight: 2 },
        { name: "React", minCompetence: 80, weight: 1.5 },
      ],
      deadline: new Date("2024-12-31"),
      createdBy: '671b6fa405349c4fa1037f61', // Use the mock user's ObjectId
    });

    console.log("Project created successfully:", project);
    process.exit(0);
  } catch (error) {
    console.error("Error creating project:", error);
    process.exit(1);
  }
};

createProject();
