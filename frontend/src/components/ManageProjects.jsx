import React, { useEffect, useState } from "react";
import AddProject from "./AddProject";
import EditProject from "./EditProject";
import ManageEmployeesModal from "./ManageEmployees";
import "./ManageProjects.css";
import { axiosInstance } from "./utils/axiosInstance";
import ViewProject from "./ViewProject";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]); // State to hold all projects
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [managingEmployees, setManagingEmployees] = useState(null); // State for modal management

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const userId = loggedInUser?._id;
  
        if (!userId) {
          console.error('User not logged in');
          return;
        }
  
        const response = await axiosInstance.get(`/projects?createdBy=${userId}`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
  
    fetchProjects();
  }, []);
  
  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await axiosInstance.delete(`/projects/${projectId}`);
      if (response.status === 200) {
        setProjects((prev) => prev.filter((project) => project._id !== projectId));
        alert("Project deleted successfully!");
      }
    } catch (error) {
      console.error("Error while deleting project", error);
      alert("Error deleting the project. Please try again.");
    }
  };

  const handleEditClick = (projectId) => {
    setEditingProject(projectId);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  const handleViewClick = (projectId) => {
    const projectToView = projects.find((project) => project._id === projectId);
    if (projectToView) {
      setViewingProject(projectToView);
    }
  };

  const handleCloseView = () => {
    setViewingProject(null);
  };

  const handleManageEmployees = (projectId) => {
    setManagingEmployees(projectId); 
  };

  const handleCancelEmployeeManagement = () => {
    setManagingEmployees(null);
  };

  return (
    <div className="manage-projects-container">
      <div className="header">
        <h2 className="title">Manage Projects</h2>
        <button
          className="add-project-btn"
          onClick={() => setShowAddProject((prev) => !prev)}
        >
          {showAddProject ? "Cancel" : "Add New Project"}
        </button>
      </div>

      {showAddProject ? (
        <AddProject setShowAddProject={setShowAddProject} />
      ) : editingProject ? (
        <EditProject
          projectId={editingProject}
          handleCancelEdit={handleCancelEdit}
          setProjects={setProjects}
          projects={projects}
        />
      ) : viewingProject ? (
        <ViewProject project={viewingProject} handleClose={handleCloseView} />
      ) : managingEmployees ? (
        <ManageEmployeesModal
          projectId={managingEmployees}
          handleCancelEmployeeManagement={handleCancelEmployeeManagement}
        />
      ) : (
        <div>
          {projects.length === 0 ? (
            <p className="empty-message">
              No projects created by you. Click <strong>Add New Project</strong> to get started!
            </p>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project._id} className="project-card">
                  <h5 className="project-title">{project.name}</h5>
                  <p className="project-detail">
                    <strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}
                  </p>
                  <p className="project-detail">
                    <strong>Status:</strong> {project.status}
                  </p>
                  <div className="project-actions">
                    <button
                      className="action-btn view-btn"
                      onClick={() => handleViewClick(project._id)}
                    >
                      View
                    </button>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditClick(project._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </button>
                    <div
                      className="modal-trigger"
                      onClick={() => handleManageEmployees(project._id)}
                    >
                      ⚙️
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageProjects;
