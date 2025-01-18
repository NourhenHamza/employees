import { Box, CircularProgress, List, ListItem, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/Project/getall");
        if (response.data && Array.isArray(response.data)) {
          const formattedProjects = response.data.map(project => ({
            ...project,
            id: project._id,
          }));
          setProjects(formattedProjects);
        } else {
          setError("Unexpected response format.");
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="error-message">
        <Typography className="error-text">
          {error}
        </Typography>
      </Box>
    );
  }

  if (projects.length === 0) {
    return (
      <Box className="empty-message">
        <Typography>No projects found.</Typography>
      </Box>
    );
  }

  return (
    <div className="manage-projects-container">
      <Box>
        <Typography className="title" gutterBottom>
          All Projects
        </Typography>
        <List className="projects-grid">
          {projects.map((project) => (
            <ListItem
              key={project.id}
              className="project-card"
            >
              <Box className="project-title">
                <Typography>
                  {project.name || "No name available"}
                </Typography>
              </Box>
              <Box className="project-actions">
                <button
                  className="view-btn"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  View
                </button>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/projects/edit/${project.id}`)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={async () => {
                    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
                    if (!confirmDelete) return;

                    try {
                      await axios.delete(`http://localhost:4000/api/Project/${project.id}`);
                      setProjects((prevProjects) =>
                        prevProjects.filter((project) => project.id !== project.id)
                      );
                    } catch (err) {
                      console.error("Error deleting project:", err);
                      alert("Failed to delete the project. Please try again.");
                    }
                  }}
                >
                  Delete
                </button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
};

export default Projects;
