import Project from "../models/projectSchema.js";
import User from "../models/userSchema.js";
import TestModel from "../models/TestModel.js";

// Get Job Seeker Statistics
export const getJobSeekerStatistics = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("skills");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch applied projects
    const appliedProjects = await Project.find({
      employeesApplied: userId,
    });

    // Fetch completed tests (optional)
    const completedTests = await TestModel.find({
      tookBy: userId,
      status: "Completed",
    });

    const matchingProjects = appliedProjects.filter((project) => {
      // Here you could add logic to filter matching projects based on skills
      return project.skillsRequired.every((skill) =>
        user.skills.some((userSkill) => userSkill.name === skill.name)
      );
    });

    return res.status(200).json({
      projectsApplied: appliedProjects.length,
      testsCompleted: completedTests.length,
      matchingProjects: matchingProjects.length,
      skills: user.skills,
      appliedProjects: appliedProjects.map((project) => ({
        id: project._id,
        name: project.name,
        description: project.description,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
