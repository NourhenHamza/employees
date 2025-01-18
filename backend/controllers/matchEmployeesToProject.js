 
import Project from "../models/projectSchema.js"; // Correct path relative to the current file

import User from "../models/userSchema.js"; // Import the User model
import { calculateMinScore } from "../services/matchingService.js";

export const matchEmployeesToProject = async (projectId) => {
  try {
    // 1. Fetch the project
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const { skillsRequired } = project;

    // 2. Calculate the total minimum score for the project
    const totalMinScore = calculateMinScore(skillsRequired);

    // 3. Fetch all users with role "Job Seeker"
    const jobSeekers = await User.find({ role: "Job Seeker" });

    // 4. Match job seekers based on scores
    const matchedEmployees = jobSeekers.filter((user) => {
      let employeeScore = 0;

      // Calculate the user's score for the required skills
      skillsRequired.forEach((skill) => {
        const userSkill = user.skills.find((s) => s.name === skill.name); // Assuming `skills` exists in the User model
        if (userSkill) {
          employeeScore += skill.weight * userSkill.score;
        }
      });

      // Match if user's score >= total minimum score
      return employeeScore >= totalMinScore;
    });

    // 5. Update the project with matched job seekers
    project.employeesMatched = matchedEmployees.map((user) => user._id);
    await project.save();

    console.log(`Matched Job Seekers Updated for Project: ${project.name}`);
  } catch (error) {
    console.error("Error in matching job seekers:", error.message);
  }
};

export default matchEmployeesToProject;
