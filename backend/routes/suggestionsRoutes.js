import express from "express";
import TestModel from "../models/TestModel.js";

const router = express.Router();

// GET: Fetch tests with status "Requested"
router.get("/", async (req, res) => {
  try {
    const tests = await TestModel.find({ status: "Requested" });
    console.log("Requested Tests:", tests);
    res.status(200).json(tests);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

// PUT: Update test status (e.g., Accept or Reject)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedTest = await TestModel.findOneAndUpdate(
      { testID: id },
      { status },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ error: "Test not found" });
    }

    console.log(`Test ${id} updated to status: ${status}`);
    res.status(200).json(updatedTest);
  } catch (error) {
    console.error("Error updating test status:", error);
    res.status(500).json({ error: "Failed to update test status" });
  }
});

export default router;
