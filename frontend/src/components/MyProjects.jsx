import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import checkmark icon
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import './MyProjects.css'; // Adjust path as necessary
import ProjectDetails from './ProjectDetails'; // Import your ProjectDetails component

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");  // State for storing cover letter content
  const [showModal, setShowModal] = useState(false); // State for controlling the modal visibility
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Store selected project ID for applying
  
  const { user } = useSelector((state) => state.user);
  const userId = user._id;

  useEffect(() => {
    if (userId) {
      const fetchProjects = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/Project/getmyProjects/${userId}`);
          if (Array.isArray(response.data)) {
            setProjects(response.data);
          } else if (response.data && Array.isArray(response.data.projects)) {
            setProjects(response.data.projects);
          } else {
            setError("Projects data is not in expected format.");
          }
        } catch (err) {
          setError("Error fetching projects.");
        } finally {
          setLoading(false);
        }
      };
      fetchProjects();
    }
  }, [userId]);

  const handleAction = async (action, projectId) => {
    if (action === "View") {
      setSelectedProject(projects.find((project) => project._id === projectId));
    } else if (action === "Apply") {
      setSelectedProjectId(projectId); // Store project ID when Apply is clicked
      setShowModal(true); // Open the modal for the cover letter form
    }
  };

  const handleCoverLetterSubmit = async () => {
    if (!coverLetter) {
      alert("Please write a cover letter before applying.");
      return;
    }

    try {
      await axios.post(`http://localhost:4000/api/Project/apply/${selectedProjectId}`, {
        userId,
        coverLetter
      });
      alert("Application submitted successfully!");
      
      // Update projects after applying
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === selectedProjectId
            ? {
                ...project,
                employeesApplied: [...project.employeesApplied, userId],
                coverLetter: coverLetter, // Add the cover letter to the project data
              }
            : project
        )
      );

      // Close the modal and reset the form
      setCoverLetter("");
      setShowModal(false);
    } catch (err) {
      alert("Error submitting application.");
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setCoverLetter(""); // Clear cover letter input when closing
    setShowModal(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box className="manage-projects-container">
      <div className="header">
        <Typography variant="h5" className="title">My Projects</Typography>
      </div>

      {selectedProject ? (
        <ProjectDetails project={selectedProject} setSelectedProject={setSelectedProject} />
      ) : (
        <div className="projects-grid">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id} className="project-card">
                <Typography className="project-title">{project.name || "No name available"}</Typography>
                {project.description && (
                  <Typography className="project-detail">{project.description}</Typography>
                )}
                {project.skillsRequired?.length > 0 && (
                  <div>
                    <Typography className="project-detail" style={{ fontWeight: "bold" }} >
                      Skills Required:
                    </Typography>
                    {project.skillsRequired.map((skill, index) => (
                      <Typography key={index} className="project-detail">
                        - {skill.name}
                      </Typography>
                    ))}
                  </div>
                )}
                <div className="project-actions">
                  <Button
                    className="action-btn view-btn"
                    onClick={() => handleAction("View", project._id)}
                  >
                    View
                  </Button>

                  {/* Show "Applied" status or "Apply" button */}
                  {project.employeesApplied.includes(userId) ? (
                    <Button
                      className="action-btn applied-btn"
                      disabled
                      startIcon={<CheckCircleIcon />} // Add checkmark icon
                    >
                      Applied
                    </Button>
                  ) : (
                    <Button
                      className="action-btn apply-btn"
                      onClick={() => handleAction("Apply", project._id)}
                    >
                      Apply
                    </Button>
                  )}
                  {/* Remove the Delete button */}
                  {/* <Button
                    className="action-btn delete-btn"
                    onClick={() => handleAction("Delete", project._id)}
                  >
                    Delete
                  </Button> */}
                </div>
              </div>
            ))
          ) : (
            <Typography>No projects found</Typography>
          )}
        </div>
      )}

      {/* Modal for writing the cover letter */}
      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle>Write Your Cover Letter</DialogTitle>
        <DialogContent>
          <TextField
            label="Cover Letter"
            multiline
            rows={6}
            variant="outlined"
            fullWidth
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write your cover letter here..."
            style={{ marginBottom: "20px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCoverLetterSubmit} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyProjects;