import express from "express";
import Project from "../models/projectSchema.js";
import Test from '../models/TestModel.js'; // Adjust the path to your Test model file
import User from "../models/userSchema.js";

import { calculateEmployeeScore, calculateMinScore } from "../services/matchingService.js";
 
const router = express.Router();

router.post("/test-matching", async (req, res) => {
  try {
    const { name, skillsRequired, deadline } = req.body;

    // Ensure all required fields are provided
    if (!name || !skillsRequired || !deadline) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new project
    const project = new Project({ name, skillsRequired, deadline,   createdBy: req.user?._id || "test-user-id", // Use a default ID for testing
    });
    await project.save();

    // Fetch all users with the "Job Seeker" role
    const jobSeekers = await User.find({ role: "Job Seeker" });

    // Match job seekers based on scores
    const matchedEmployees = jobSeekers.filter((user) => {
      const employeeScore = calculateEmployeeScore(user.skills, skillsRequired);
      return employeeScore >= calculateMinScore(skillsRequired);
    });

    // Add matched employees to the project
    project.employeesMatched = matchedEmployees.map((user) => user._id);
    await project.save();

    res.status(200).json({ project });
  } catch (error) {
    console.error("Error in test-matching route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
 
// Route to get the number of quizzes created by a recruiter
// Route to get the number of quizzes created by a recruiter
router.get('/recruiter/statistics/by-username/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Trim the username to avoid unwanted spaces
    const recruiterName = username.trim();

    // Find all tests created by this recruiter (createdBy: recruiterName)
    const tests = await Test.find({ createdBy: recruiterName });

    if (!tests || tests.length === 0) {
      return res.status(404).json({ message: 'No tests found for this recruiter' });
    }

    // Calculate statistics
    const totalTests = tests.length;
    const totalApplicants = tests.reduce((acc, test) => acc + test.tookBy.length, 0);

    // Map the tests to include the necessary fields for the response
    const testDetails = tests.map(test => ({
      testID: test.testID,
      testName: test.testName,
      createdBy: test.createdBy,
      testDuration: test.testDuration,
      createdAt: test.createdAt,
      status: test.status
    }));

    // Send the statistics and test details as a response
    res.status(200).json({
      recruiterName,
      totalTests,
      totalApplicants,
      testDetails
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Error fetching recruiter statistics' });
  }
});





export default router;
