import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false }, // Description non requise
    skillsRequired: [
      {
        name: { type: String, required: true }, // Skill name
        minCompetence: { type: Number, required: true, min: 0, max: 100 }, // Minimum score for skill
        weight: { type: Number, required: true, min: 0.1 }, // Skill importance
      },
    ],
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed"],
      default: "Open",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employeesMatched: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Matched employees
    employeesApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Employees who applied
    employeesAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Employees assigned
    totalScore: { type: Number, default: 0 }, // Total minimum score for the project
    profilePhoto: { type: String, required: false }, // Optional field for project profile photo
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
