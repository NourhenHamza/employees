import express from "express";
import mongoose from "mongoose";
import { createProject, deleteProject, getAllProjects, getASingleProject, getEmployeeById, getMyProjectEmployees, getMyProjects, getProjectById, updateProject } from "../controllers/ProjectController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import Project from "../models/projectSchema.js";


const router = express.Router();
 
 
router.get("/getall", getAllProjects);
router.get("/getmyProjects", isAuthenticated, isAuthorized("Job Seeker"), getMyProjects);
router.get("/getmyProjects/:id", getMyProjects);
router.get("/getMyProjectEmployees/:id",getMyProjectEmployees);
 
router.post("/create", createProject);
router.delete("/delete/:id", deleteProject);
router.get("/get/:id", getASingleProject)
router.get('/projects/:id', getProjectById);
// Route pour mettre à jour un projet
 
router.put('/update/:id', updateProject); 

router.get('/employees/:employeeId', getEmployeeById);


router.post('/create-project', async (req, res) => {
  try {
    // Create a new project from the request body
    const newProject = new Project({
      name: req.body.name,
      description: req.body.description,
      skillsRequired: req.body.skillsRequired,
      deadline: req.body.deadline,
      status: req.body.status,
      createdBy: req.body.createdBy,
      employeesMatched: req.body.employeesMatched,
      employeesApplied: req.body.employeesApplied, // Add employeesApplied from the request body
      employeesAssigned: req.body.employeesAssigned, // Add employeesAssigned from the request body
    });

    // Save the project to the database
    await newProject.save();

    // Respond with the created project
    res.status(201).json({
      message: 'Project created successfully!',
      project: newProject,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      message: 'Error creating project',
      error: error.message,
    });
  }
});


router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    // Validate the projectId as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid Project ID" });
    }

    // Fetch the project by its ID with selected fields
    const project = await Project.findById(projectId)
      .select("name description deadline createdBy")  // Select only the necessary fields
      .populate("createdBy", "name")  // Populate the creator's name
      .populate({
        path: "skillsRequired",  // Populate the required skills
        select: "name",           // Only select the name field
      });

    // If no project is found, return 404 error
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Return the project data as response
    return res.status(200).json(project);
  } catch (error) {
    // Log the error stack for better debugging
    console.error("Error fetching project details:", error);
    
    // Return the error in the response, including the error stack for debugging
    return res.status(500).json({ message: "Error fetching project details", error: error.message || error.stack });
  }
});

// API endpoint for applying to a project
router.post("/apply/:projectId", async (req, res) => {
  const { userId } = req.body; // The job seeker's ID from the frontend (you can get it from the JWT or request body)
  const { projectId } = req.params; // The project ID from the URL params

  try {
    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the user is already in the employeesMatched array
    if (!project.employeesMatched.includes(userId)) {
      return res.status(400).json({ message: "You are not matched with this project" });
    }

    // Add the user to employeesApplied and remove from employeesMatched
    project.employeesMatched = project.employeesMatched.filter(
      (empId) => !empId.equals(userId)
    );
    project.employeesApplied.push(userId);

    // Save the project with updated arrays
    await project.save();

    res.status(200).json({ message: "Successfully applied to the project" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get applied projects for a job seeker
router.get('/getAppliedProjects/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find projects where the userId is in the 'employeesApplied' array
    const appliedProjects = await Project.find({
      employeesApplied: { $in: [userId] }, // Match projects where userId is in the applied list
    });

    if (!appliedProjects) {
      return res.status(404).json({ message: 'No applied projects found for this user.' });
    }

    return res.status(200).json(appliedProjects); // Return the list of applied projects
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while fetching applied projects.' });
  }
});
router.get('/recruiter/statistics/:userId', async (req, res) => {
  try {
    let { userId } = req.params;

    // Trim any unwanted characters (like newline) from the userId
    userId = userId.trim();

    // Ensure the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Query the projects created by the recruiter (createdBy: userId)
    const projects = await Project.find({ createdBy: userId });

    // Calculate statistics
    const employersApplied = projects.reduce((acc, project) => acc + project.employeesApplied.length, 0);
    const matchesAssigned = projects.reduce((acc, project) => acc + project.employeesAssigned.length, 0);
    const matchingEmployers = projects.reduce((acc, project) => acc + project.employeesMatched.length, 0);

    // Send the statistics as a response
    res.status(200).json({
      employersApplied,
      matchesAssigned,
      matchingEmployers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching recruiter statistics' });
  }
});
// POST route to assign an employer to a project
router.post("/assign-employer/:projectId/:employerId", async (req, res) => {
  let { projectId, employerId } = req.params;

  // Trim spaces and ensure IDs are strings
  projectId = projectId.trim();
  employerId = employerId.trim();

  // Log the IDs to debug
  console.log("Project ID:", projectId);
  console.log("Employer ID:", employerId);

  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(employerId)) {
    return res.status(400).json({ message: "Invalid projectId or employerId format" });
  }

  try {
    const projectObjectId = new mongoose.Types.ObjectId(projectId);
    const employerObjectId = new mongoose.Types.ObjectId(employerId);

    const project = await Project.findById(projectObjectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.employeesApplied.includes(employerObjectId)) {
      return res.status(400).json({ message: "Employer not found in applied list" });
    }

    project.employeesApplied = project.employeesApplied.filter(
      (empId) => empId.toString() !== employerObjectId.toString()
    );
    project.employeesAssigned.push(employerObjectId);

    await project.save();

    res.status(200).json({
      message: "Employer successfully assigned",
      project: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Endpoint to fetch projects where an employee applied
router.get("/applications/:employeeId", async (req, res) => {
    const { employeeId } = req.params;
  
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required." });
    }
  
    try {
      const projects = await Project.find({
        employeesApplied: employeeId,
      }).populate("createdBy", "name email"); // Populate creator details if needed
  
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: "No applications found for this employee." });
      }
  
      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications. Please try again later." });
    }
  });



export default router;