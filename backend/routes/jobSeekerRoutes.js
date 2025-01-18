import express from "express";
import { getJobSeekerStatistics } from "../controllers/jobSeekerController.js";

const router = express.Router();

// Route to get job seeker statistics
router.get("/statistics/:id", getJobSeekerStatistics);

export default router;
