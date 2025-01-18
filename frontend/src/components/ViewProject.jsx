import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { FaCalendarAlt, FaTasks, FaUsers } from "react-icons/fa";
import "./ViewProject.css";

const ViewProject = ({ project, handleClose }) => {
  useEffect(() => {
    console.log("Loaded Project:", project);
  }, [project]);

  if (!project) return <div>Loading...</div>;

  return (
    <motion.div
      className="project-view-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="header-section">
        <h1>🚀 Project Details</h1>
        <button className="close-btn" onClick={handleClose}>
          ✖
        </button>
      </div>

      <motion.div
        className="content"
        initial={{ x: "-10%" }}
        animate={{ x: "0%" }}
        transition={{ duration: 0.5 }}
      >
        {/* Info Section */}
        <div className="project-info-section">
          <div className="info-box">
            <div>
              <FaTasks className="icon" />
              <h4>Project Name:</h4>
              <p>{project.name}</p>
            </div>
            <div>
              <FaCalendarAlt className="icon" />
              <h4>Deadline:</h4>
              <p>{new Date(project.deadline).toLocaleDateString()}</p>
            </div>
            <div>
              <FaUsers className="icon" />
              <h4>Status:</h4>
              <p>{project.status}</p>
            </div>
          </div>
        </div>

        {/* Skills Representation */}
        <motion.div
          className="skills-section"
          initial={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <h3>💡 Skills Required</h3>
          {project.skillsRequired.length > 0 ? (
  project.skillsRequired.map((skill, index) => (
    <div className="skill-bar-container" key={index}>
      <p>{skill.name} - {skill.minCompetence}%</p>
      <div className="progress-bar">
        <div
          className="filled-bar"
          style={{ width: `${skill.minCompetence}%` }}
        />
      </div>
    </div>
  ))
) : (
  <p>No required skills listed.</p>
)}

        </motion.div>

        {/* Employee Grid */}
        <motion.div className="employee-section">
  <h3>👥 Employees Involved</h3>
  <div className="employee-grid">
    {["Applied", "Matched", "Assigned"].map((type) => (
      <motion.div
        className="employee-box"
        whileHover={{ backgroundColor: "#dff6ff", scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <h4>{type} Employees</h4>
        <ul>
          {project[`employees${type}`]?.length > 0 ? (
            project[`employees${type}`].map((user, idx) => (
              <li key={idx}>{user}</li>
            ))
          ) : (
            <li>No employees</li>
          )}
        </ul>
      </motion.div>
    ))}
  </div>
</motion.div>

      </motion.div>
    </motion.div>
  );
};

export default ViewProject;