import React, { useState, useEffect } from "react";
import { axiosInstance } from "./utils/axiosInstance";

const EditProject = ({ projectId, handleCancelEdit, setProjects, projects }) => {
  const [projectData, setProjectData] = useState({
    name: '',
    skillsRequired: [{ name: '', minCompetence: 0, weight: 0 }],
    deadline: '',
    competenceMinimum: 0,
    status: 'Open',
  });

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axiosInstance.get(`/projects/${projectId}`);
        const { name, skillsRequired, deadline, competenceMinimum, status } = response.data;

        setProjectData({
          name,
          skillsRequired: skillsRequired.length
            ? skillsRequired
            : [{ name: '', minCompetence: 0, weight: 0 }],
          deadline: new Date(deadline).toISOString().split("T")[0],
          competenceMinimum,
          status,
        });
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.put(`/projects/${projectId}`, projectData);
      setProjects((prev) =>
        prev.map((project) =>
          project._id === projectId ? response.data : project
        )
      );
      alert("Project updated successfully!");
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating project:", error.response ? error.response.data : error.message);
      alert("Failed to update project! Check console for details.");
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...projectData.skillsRequired];
    updatedSkills[index][field] = value;
    setProjectData({ ...projectData, skillsRequired: updatedSkills });
  };

  const addSkillField = () => {
    setProjectData({
      ...projectData,
      skillsRequired: [...projectData.skillsRequired, { name: '', minCompetence: 0, weight: 0 }],
    });
  };

  const removeSkillField = (index) => {
    const updatedSkills = [...projectData.skillsRequired];
    updatedSkills.splice(index, 1);
    setProjectData({ ...projectData, skillsRequired: updatedSkills });
  };

  return (
    <div className="edit-project-container">
      <h3>Edit Project</h3>
      <div className="edit-project-form">
        {/* Name Input */}
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={projectData.name}
            onChange={handleChange}
          />
        </label>

        {/* Deadline Input */}
        <label>
          Deadline:
          <input
            type="date"
            name="deadline"
            value={projectData.deadline}
            onChange={handleChange}
          />
        </label>

        {/* Competence Minimum Input */}
        <label>
          Competence Minimum:
          <input
            type="number"
            name="competenceMinimum"
            value={projectData.competenceMinimum}
            min="0"
            onChange={handleChange}
          />
        </label>

        {/* Status Dropdown */}
        <label>
          Status:
          <select
            name="status"
            value={projectData.status}
            onChange={handleChange}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </label>

        {/* Skills Section */}
        <div className="skills-section">
          <h4>Skills Required</h4>
          {projectData.skillsRequired.map((skill, index) => (
            <div className="skill-item" key={index}>
              <input
                type="text"
                placeholder="Skill Name"
                value={skill.name}
                onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
              />
              <input
                type="number"
                placeholder="Min Competence"
                min="0"
                max="100"
                value={skill.minCompetence}
                onChange={(e) => handleSkillChange(index, 'minCompetence', e.target.value)}
              />
              <input
                type="number"
                placeholder="Weight"
                min="0.1"
                value={skill.weight}
                onChange={(e) => handleSkillChange(index, 'weight', e.target.value)}
              />
              <button type="button" onClick={() => removeSkillField(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="add-skill-btn" onClick={addSkillField}>
            Add Skill
          </button>
        </div>
      </div>

      <div className="actions">
        <button onClick={handleSubmit} className="save-btn">Save Changes</button>
        <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default EditProject;