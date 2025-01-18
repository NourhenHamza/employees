import express from "express";
import { Types } from "mongoose";
import ProjectModel from "../models/projectSchema.js";
import { calculateMinScore, matchEmployeesToProject } from "../services/matchingService.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { name, skillsRequired, deadline, createdBy, status } = req.body;

    console.log("Received data for project creation:", req.body);

    // Validate required fields
    if (!name || !skillsRequired || !deadline || !createdBy) {
      return res.status(400).json({ error: "Missing required fields: name, skillsRequired, deadline, createdBy" });
    }

    // Validate `createdBy` ObjectId
    if (!Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ error: "Invalid createdBy ID" });
    }

    // Validate `skillsRequired` structure
    if (
      !Array.isArray(skillsRequired) ||
      !skillsRequired.every((skill) => skill.name && skill.minCompetence && skill.weight)
    ) {
      return res.status(400).json({
        error: "Invalid skillsRequired format. Each skill must include 'name', 'minCompetence', and 'weight'.",
      });
    }

    // Validate `status` if provided
    const validStatuses = ["Open", "In Progress", "Completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value. Must be 'Open', 'In Progress', or 'Completed'." });
    }

    // Parse and validate the deadline
    const parsedDeadline = new Date(deadline);
    if (isNaN(parsedDeadline)) {
      return res.status(400).json({ error: "Invalid deadline format. Must be a valid date." });
    }

    // Create the new project
    const newProject = new ProjectModel({
      name,
      skillsRequired,
      deadline: parsedDeadline,
      createdBy,
      status: status || "Open", // Default to "Open" if status is not provided
    });

    // Calculate the project's total minimum score
    const totalScore = calculateMinScore(skillsRequired);
    newProject.totalScore = totalScore;

    // Save the project to the database
    const savedProject = await newProject.save();

    console.log("Saved project:", savedProject);

    // Match employees to the project
    await matchEmployeesToProject(savedProject);

    // Refetch the updated project with matched employees
    const updatedProject = await ProjectModel.findById(savedProject._id).populate(
      "employeesMatched",
      "name skills"
    );

    console.log("Updated project with matched employees:", updatedProject);

    res.status(201).json(updatedProject);
  } catch (error) {
    console.error("Error while creating project:", error.stack);
    res.status(500).json({ error: error.message });
  }
});





router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await ProjectModel.findById(id).populate("createdBy", "name");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update a project by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, skillsRequired, deadline, competenceMinimum, status } = req.body;

    // Validate `skillsRequired` structure
    if (
      !Array.isArray(skillsRequired) ||
      !skillsRequired.every((skill) => skill.name && skill.minCompetence && skill.weight)
    ) {
      return res.status(400).json({
        error: "Invalid skillsRequired format. Each skill must include 'name', 'minCompetence', and 'weight'.",
      });
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        skillsRequired,
        deadline,
        competenceMinimum,
        status,
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: error.message });
  }
});










router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const deletedProject = await ProjectModel.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: error.message });
  }
});







// Assuming you want to get all projects created by the logged-in user
router.get("/", async (req, res) => {
  try {
    const { createdBy } = req.query; // Pass the createdBy from the frontend

    if (!Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const projects = await ProjectModel.find({ createdBy }).populate("createdBy", "name");

    if (projects.length === 0) {
      return res.status(404).json({ error: "No projects found for this user" });
    }

    res.status(200).json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    res.status(500).json({ error: err.message });
  }
});
















// Assign an employee to a project
router.patch("/:projectId/assign-employee", async (req, res) => {
  const { projectId } = req.params;
  const { employeeId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.employeesApplied.includes(employeeId)) {
      return res.status(400).json({ message: "Employee did not apply to this project" });
    }

    if (!project.employeesAssigned.includes(employeeId)) {
      project.employeesAssigned.push(employeeId);
      project.employeesApplied = project.employeesApplied.filter((id) => id.toString() !== employeeId);
    }

    await project.save();
    res.status(200).json({ message: "Employee assigned successfully" });
  } catch (error) {
    console.error("Error assigning employee:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove an employee from a project
router.patch("/:projectId/remove-employee", async (req, res) => {
  const { projectId } = req.params;
  const { employeeId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.employeesAssigned = project.employeesAssigned.filter((id) => id.toString() !== employeeId);
    project.employeesApplied.push(employeeId);

    await project.save();
    res.status(200).json({ message: "Employee removed successfully" });
  } catch (error) {
    console.error("Error removing employee:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch project details
router.get("/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId)
      .populate("employeesApplied", "name email")
      .populate("employeesMatched", "name email")
      .populate("employeesAssigned", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error" });
  }
});







// Get employees who applied to a specific project
router.get("/applied/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
    // Validate the project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID format" });
    }

    // Find the project and populate the employeesApplied field
    const project = await Project.findById(projectId).populate(
      "employeesApplied", // Populate the referenced employees
      "name email skills" // Only return selected fields from the User model
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Send the populated employeesApplied data
    res.status(200).json({
      projectId: project._id,
      employeesApplied: project.employeesApplied,
    });
  } catch (error) {
    console.error("Error fetching employeesApplied:", error);
    res.status(500).json({ error: "Server error" });
  }
});












 


export default router;
