import mongoose from "mongoose";
import Project from "./models/projectSchema.js";
import { calculateMinScore, matchEmployeesToProject } from "./services/matchingService.js"; // Adjust the path as needed

const calculateScores = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/JOB_PORTAL_WITH_AUTOMATION", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Fetch the project
    const projectId = "6760241f04cdab3430f93935"; // Replace with your project ID
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    console.log("Project before update:", project);

    // Calculate the project's total minimum score
    const projectMinScore = calculateMinScore(project.skillsRequired);
    console.log(`Project Total Minimum Score: ${projectMinScore}`);

    // Update the project's total score and save it
    project.totalScore = projectMinScore;
    await project.save();

    console.log("Project after updating totalScore:", project);

    // Match employees to the project
    await matchEmployeesToProject(project);

    console.log("Final Project with Matched Employees:", project);

    process.exit(0);
  } catch (error) {
    console.error("Error calculating scores:", error);
    process.exit(1);
  }
};

calculateScores();
