import mongoose from "mongoose";
import { matchEmployeesToProject } from "../controllers/matchEmployeesToProject.js";
import Project from "../models/projectSchema.js";
import User from "../models/userSchema.js";

// Create a Project
export const createProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();

    // Trigger the matching system
    await matchEmployeesToProject(newProject._id);

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Trigger the matching system
    await matchEmployeesToProject(project._id);

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    // Récupérer les projets avec les données de l'utilisateur qui a créé le projet
    const projects = await Project.find().populate('createdBy', 'name');
    
    // Mapper les projets pour renommer _id en id
    const formattedProjects = projects.map(project => ({
      ...project._doc,  // Conserver tous les champs du projet
      id: project._id.toString(),  // Remplacer _id par id
    }));

    // Renvoyer les projets formatés
    return res.status(200).json(formattedProjects);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching projects", error });
  }
};

export const getProjectById = async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await Project.findById(projectId); // Supposons que vous utilisez Mongoose
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a single project by ID
export const getASingleProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy', 'name')
      .populate('employeesMatched', 'name')
      .populate('employeesApplied', 'name')
      .populate('employeesAssigned', 'name');
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching project", error });
  }
};

// Get projects that the authenticated user is involved in (either applied, assigned, or matched)



export const getMyProjects = async (req, res) => {
  try {
    const userId = req.params.id.trim(); // Remove unnecessary spaces

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // Retrieve the projects with the required details
    const projects = await Project.find({
      employeesMatched: userId,
    })
      .populate("createdBy", "name") // Include the creator's name
      .populate({
        path: "skillsRequired", // Include required skills
        select: "name minCompetence weight", // Select necessary fields
      });

    // Check if any projects were found
    if (!projects.length) {
      return res.status(404).json({ message: "No projects found for this Job Seeker" });
    }

    // Return the projects with enriched information
    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ message: "Error fetching projects", error });
  }
};

export const getMyProjectEmployees = async (req, res) => {
  try {
    const userId = req.params.id.trim(); // Remove unnecessary spaces

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // Retrieve the projects associated with the userId (either as creator or in employee arrays)
    const projects = await Project.find({
      $or: [
        { createdBy: userId }, // Check if the user is the creator
        { employeesMatched: userId }, // Check if the user is matched
        { employeesApplied: userId }, // Check if the user applied
        { employeesAssigned: userId } // Check if the user is assigned
      ]
    })
      .populate("createdBy", "name") // Include the creator's name
      .populate({
        path: "employeesMatched",
        select: "name profilePhoto address _id", // Include _id to return employee ID
      })
      .populate({
        path: "employeesApplied",
        select: "name profilePhoto address _id", // Include _id to return employee ID
      })
      .populate({
        path: "employeesAssigned",
        select: "name profilePhoto address _id", // Include _id to return employee ID
      });

    // If no projects found, return a message
    if (!projects.length) {
      return res.status(404).json({ message: "No projects found for this User" });
    }

    // Format the response to include the required fields in each category (matching, applied, assigned)
    const formattedProjects = projects.map(project => ({
      projectId: project._id, // Include the project ID
      projectName: project.name,
      employeesMatched: project.employeesMatched.map(employee => ({
        employeeId: employee._id, // Include employee ID
        profilePhoto: employee.profilePhoto,
        employeeName: employee.name,
        address: employee.address,
        projectName: project.name // Include the project name
      })),
      employeesApplied: project.employeesApplied.map(employee => ({
        employeeId: employee._id, // Include employee ID
        profilePhoto: employee.profilePhoto,
        employeeName: employee.name,
        address: employee.address,
        projectName: project.name // Include the project name
      })),
      employeesAssigned: project.employeesAssigned.map(employee => ({
        employeeId: employee._id, // Include employee ID
        profilePhoto: employee.profilePhoto,
        employeeName: employee.name,
        address: employee.address,
        projectName: project.name // Include the project name
      }))
    }));

    // Now structure the response by "matching", "assigned", and "applied"
    const response = {
      matching: [],
      applied: [],
      assigned: []
    };

    // Add employees to the correct category
    formattedProjects.forEach(project => {
      project.employeesMatched.forEach(employee => {
        response.matching.push({
          employeeId: employee.employeeId, // Include employee ID
          profilePhoto: employee.profilePhoto,
          employeeName: employee.employeeName,
          address: employee.address,
          projectName: employee.projectName,
          projectId: project.projectId // Include project ID
        });
      });

      project.employeesApplied.forEach(employee => {
        response.applied.push({
          employeeId: employee.employeeId, // Include employee ID
          profilePhoto: employee.profilePhoto,
          employeeName: employee.employeeName,
          address: employee.address,
          projectName: employee.projectName,
          projectId: project.projectId // Include project ID
        });
      });

      project.employeesAssigned.forEach(employee => {
        response.assigned.push({
          employeeId: employee.employeeId, // Include employee ID
          profilePhoto: employee.profilePhoto,
          employeeName: employee.employeeName,
          address: employee.address,
          projectName: employee.projectName,
          projectId: project.projectId // Include project ID
        });
      });
    });

    // Return the structured response
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ message: "Error fetching projects", error });
  }
};

// Controller for deleting a project
export const deleteProject = async (req, res) => {
  try {
    // Get the project ID from the request parameters
    const { id } = req.params;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Project ID' });
    }

    // Attempt to find and delete the project
    const project = await Project.findByIdAndDelete(id);

    // If the project is not found, return a 404 error
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Return a success response
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

 

export const getEmployeeById = async (req, res) => {
  try {
    let { employeeId } = req.params;  // Extraction de l'ID de l'employé
    console.log('Searching for employee with ID:', employeeId);  // Log de l'ID

    // Supprimer les espaces ou nouvelles lignes qui pourraient être présents dans l'ID
    employeeId = employeeId.trim();

    // Recherche de l'employé avec l'ID et qui a le rôle 'Job Seeker'
    const employee = await User.findOne({
      _id: employeeId,
      role: 'Job Seeker'  // Vérifiez que le rôle est "Job Seeker"
    }).select('name email phone coverLetter resume skills address');  // On ne sélectionne plus 'location'

    if (!employee) {
      console.log('Employee not found with ID:', employeeId);  // Log si l'employé n'est pas trouvé
      return res.status(404).json({ message: 'Employee not found' });
    }

    console.log('Employee found:', employee);  // Log de l'employé trouvé

    // Si l'employé est trouvé, renvoie les données
    res.status(200).json({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      coverLetter: employee.coverLetter || "Aucune lettre de motivation",  // Ajout d'un message par défaut si vide
      resume: employee.resume || {},  // Renvoi d'un objet vide si aucun CV n'est présent
      skills: employee.skills.map(skill => ({
        name: skill.name,
        score: skill.score
      })),
      address: employee.address || "Non spécifié",  // Ajout de l'adresse avec une valeur par défaut si vide
    });

  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};





