import React, { useState } from 'react';
import { axiosInstance } from "./utils/axiosInstance";

const AddProject = ({ setShowAddProject }) => {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '', // Description field
    skillsRequired: [{ name: '', minCompetence: 0, weight: 0 }],
    deadline: '',
    status: 'Open',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...projectData.skillsRequired];
    updatedSkills[index][field] = value;
    setProjectData((prev) => ({
      ...prev,
      skillsRequired: updatedSkills,
    }));
  };

  const addSkill = () => {
    setProjectData((prev) => ({
      ...prev,
      skillsRequired: [...prev.skillsRequired, { name: '', minCompetence: 0, weight: 0 }],
    }));
  };

  const removeSkill = (index) => {
    const updatedSkills = projectData.skillsRequired.filter((_, i) => i !== index);
    setProjectData((prev) => ({
      ...prev,
      skillsRequired: updatedSkills,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const userId = loggedInUser?._id; // Ensure correct property name for the logged-in user ID

    if (!userId) {
      alert("User not logged in or invalid session.");
      return;
    }

    const payload = {
      name: projectData.name,
      description: projectData.description,
      skillsRequired: projectData.skillsRequired.map((skill) => ({
        name: skill.name,
        minCompetence: skill.minCompetence,
        weight: skill.weight,
      })),
      deadline: projectData.deadline,
      status: projectData.status,
      createdBy: userId, // Dynamically set from logged-in user
    };

    try {
      const response = await axiosInstance.post('/projects/add', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      alert('Project added successfully!');
      setProjectData({
        name: '',
        description: '',
        skillsRequired: [{ name: '', minCompetence: 0, weight: 0 }],
        deadline: '',
        status: 'Open',
      });
      setShowAddProject(false);
    } catch (error) {
      alert('Error adding project: ' + (error.response?.data.message || error.message));
    }
  };

  return (
    <div className="add-project-modal">
      <div className="add-project-card">
        <h3 className="add-project-title">Add New Project</h3>
        <form onSubmit={handleSubmit} className="add-project-form">
          <div className="form-group">
            <label htmlFor="name">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={projectData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Project Description</label>
            <textarea
              id="description"
              name="description"
              value={projectData.description}
              onChange={handleChange}
              required
            />
          </div>

          {projectData.skillsRequired.map((skill, index) => (
            <div key={index} className="form-group">
              <label htmlFor={`skill-name-${index}`}>Skill Name</label>
              <input
                type="text"
                id={`skill-name-${index}`}
                name="name"
                value={skill.name}
                onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                required
              />
              <label htmlFor={`min-competence-${index}`}>Minimum Competence</label>
              <input
                type="number"
                id={`min-competence-${index}`}
                name="minCompetence"
                value={skill.minCompetence}
                onChange={(e) => handleSkillChange(index, 'minCompetence', e.target.value)}
                required
              />
              <label htmlFor={`weight-${index}`}>Skill Weight</label>
              <input
                type="number"
                id={`weight-${index}`}
                name="weight"
                value={skill.weight}
                onChange={(e) => handleSkillChange(index, 'weight', e.target.value)}
                required
              />
              <button type="button" onClick={() => removeSkill(index)}>Remove Skill</button>
            </div>
          ))}

          <button type="button" onClick={addSkill}>Add Skill</button>

          <div className="form-group">
            <label htmlFor="deadline">Project Deadline</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={projectData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Project Status</label>
            <select
              id="status"
              name="status"
              value={projectData.status}
              onChange={handleChange}
              required
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          <button type="submit">Add Project</button>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
