// controllers/testController.js
import TestModel from '../models/TestModel.js'; // Adjust the path as necessary

export const getAllTests = async (req, res) => {
    try {
        const tests = await TestModel.find(); // Fetch all tests from the database
        res.status(200).json(tests); // Return the tests in the response
    } catch (error) {
        console.error("Error fetching tests:", error);
        res.status(500).json({ message: 'Error fetching tests' });
    }
};

export const getTestById = async (req, res) => {
    try {
      const test = await TestModel.findOne({ testID: req.params.testID });
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }
      res.json(test);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch test' });
    }
  };

  // Controller to get the number of quizzes created by a recruiter
  export const getQuizCountByRecruiter = async (req, res) => {
    const recruiterId = req.params.recruiterId; // Recruiter ID from the route parameter
  
    try {
      const quizCount = await TestModel.countDocuments({ createdBy: recruiterId });
  
      res.status(200).json({ quizCount });
    } catch (error) {
      console.error("Error fetching quiz count:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };