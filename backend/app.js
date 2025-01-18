import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { newsLetterCron } from "./automation/newsLetterCron.js";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import TestModel from "./models/TestModel.js";
 
import jobRouter from "./routes/jobRouter.js";
import jobSeekerRoutes from "./routes/jobSeekerRoutes.js"; // For job seeker routes
import ProjectRouter from "./routes/ProjectRouter.js";
import suggestionsRoutes from "./routes/suggestionsRoutes.js"; // For /api/v1/suggestions
import testRoutes from "./routes/testRoutes.js";
import userRouter from "./routes/userRouter.js";

import bodyParser from "body-parser";
import User from "./models/userSchema.js"; // Update path to your User model
import projectRoutes from "./routes/projectRoutes.js";

config({ path: "./config/keys.js" });
config({ path: ".env" });

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5176",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Origin: ", origin); // For debugging purposes
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Middleware for parsing cookies and JSON requests
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use("/public", express.static("public"));

// Application Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
 
app.use("/api/v1/tests", testRoutes); // Test routes
app.use("/api/Project", ProjectRouter);
app.use("/api/v1/suggestions", suggestionsRoutes); // Suggestions routes
app.use("/api/v1/projects", projectRoutes);
app.use("/api/jobseeker", jobSeekerRoutes); // Job seeker routes

// Route to fetch tests
app.get("/api/tests", async (req, res) => {
  try {
    const tests = await TestModel.find({});
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Route to delete a user
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Route to create a new test
app.post("/api/createtest", async (req, res) => {
  try {
    const test = await TestModel.create(req.body);
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start cron job for the newsletter
newsLetterCron();

// Connect to the database
connection();

// Error handling middleware
app.use(errorMiddleware);

// Export the app for server use
export default app;
