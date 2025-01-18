import User from "../models/userSchema.js"; // Import the User model
import Project from "../models/projectSchema.js"; // Ensure Project is also imported

// Calculate the total minimum score for a project
export function calculateMinScore(skillsRequired) {
  if (!Array.isArray(skillsRequired)) {
    throw new Error("skillsRequired must be an array");
  }

  return skillsRequired.reduce((total, skill) => {
    if (!skill.weight || !skill.minCompetence) {
      throw new Error("Each skill must have a weight and minCompetence");
    }
    return total + skill.weight * skill.minCompetence;
  }, 0);
}

// Calculate an employee's total score for a project
export function calculateEmployeeScore(employeeSkills, skillsRequired) {
  if (!Array.isArray(employeeSkills) || !Array.isArray(skillsRequired)) {
    throw new Error("employeeSkills and skillsRequired must be arrays");
  }

  return skillsRequired.reduce((total, skill) => {
    const employeeSkill = employeeSkills.find(
      (s) => s.name.toLowerCase() === skill.name.toLowerCase()
    );
    if (employeeSkill && typeof employeeSkill.score === "number") {
      total += skill.weight * employeeSkill.score;
    }
    return total;
  }, 0);
}

// Match employees to a project based on scores
export async function matchEmployeesToProject(project) {
  try {
    const matchedEmployees = [];

    // Fetch all job seekers
    const users = await User.find({ role: "Job Seeker" }); // Fetch users with role "Job Seeker"

    users.forEach((user) => {
      const employeeScore = calculateEmployeeScore(user.skills, project.skillsRequired);
      console.log(`User: ${user.name}, Score: ${employeeScore}`);

      if (employeeScore >= project.totalScore) {
        console.log(`User ${user.name} matches the project.`);
        matchedEmployees.push(user._id); // Add matched employee's ID
      }
    });

    // Update the project with matched employees
    project.employeesMatched = matchedEmployees;
    await project.save();

    console.log("Updated Project with matched employees:", project);
  } catch (error) {
    console.error("Error in matching employees to project:", error);
    throw error;
  }
}
