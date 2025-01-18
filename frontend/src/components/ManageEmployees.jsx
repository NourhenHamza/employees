import axios from "axios";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import "./ManageEmployees.css";
import ViewEmployee from "./ViewEmployee"; // Import the ViewEmployee component

const ManageEmployees = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showApplied, setShowApplied] = useState(false);
  const [showAssigned, setShowAssigned] = useState(false);
  const [showMatching, setShowMatching] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null); // State to track selected employee

  // Fetch projects function
  const fetchProjects = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const userId = loggedInUser?._id;

      if (!userId) {
        setError("User not logged in");
        return;
      }

      const response = await axios.get(
        `http://localhost:4000/api/Project/getMyProjectEmployees/${userId}`
      );
      
      if (response.data) {
        setProjects(response.data);
      } else {
        setError("Error: Data format is incorrect.");
      }
    } catch (err) {
      setError("Error fetching projects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const toggleShowApplied = () => setShowApplied((prevState) => !prevState);
  const toggleShowAssigned = () => setShowAssigned((prevState) => !prevState);
  const toggleShowMatching = () => setShowMatching((prevState) => !prevState);

  const assignEmployee = async (projectId, employeeId) => {
    try {
      const response = await axios.post(
       `http://localhost:4000/api/Project/assign-employer/${projectId}/${employeeId}`
      );

      if (response.data.message === "Employer successfully assigned") {
        fetchProjects();
        alert("Employee successfully assigned!");
      } else {
        alert("Failed to assign employee.");
      }
    } catch (error) {
      console.error("Error assigning employee:", error);
      alert("There was an error assigning the employee.");
    }
  };

  const handleCardClick = (employee) => {
    setSelectedEmployee(employee); // Set the selected employee
  };

  const handleBackToManage = () => {
    setSelectedEmployee(null); // Reset to go back to ManageEmployees view
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="employee-container">
      {selectedEmployee ? (
        /** Render ViewEmployee component if an employee is selected */
        <ViewEmployee
          employerId={selectedEmployee.employeeId} // Pass the employerId from selectedEmployee
          onBack={handleBackToManage} // Pass the back handler
        />
      ) : (
        <>
          <div className="header">
            <h1 className="title">Manage Employees</h1>
          </div>

          {/* Applied Employees Section */}
          <div className="employee-section">
            <h3 className="section-title">Applied Employees</h3>
            <div className="employee-list applied">
              {projects.applied?.length === 0 ? (
                <p className="no-employees">No applied employees for this project.</p>
              ) : (
                projects.applied
                  .slice(0, showApplied ? projects.applied.length : 3)
                  .map((employee, idx) => (
                    <div
                      key={idx}
                      className="employee-card"
                      onClick={() => handleCardClick(employee)} // Handle card click
                    >
                      <div className="employee-avatar">
                        <Avatar
                          name={employee.employeeName}
                          src={employee.profilePhoto}
                          size="100"
                          round={true}
                          className="employee-img"
                        />
                      </div>
                      <div className="employee-info">
                        <h2>{employee.employeeName}</h2>
                        <p><strong>Location:</strong> {employee.address}</p>
                        <p><strong>Project:</strong> {employee.projectName}</p>
                      </div>
                      <input type="hidden" value={employee.projectId} />
                      <input type="hidden" value={employee.employeeId} />
                      <div className="employee-card-actions">
                        <button
                          className="back-btn"
                          onClick={() =>
                            assignEmployee(employee.projectId, employee.employeeId)
                          }
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
            {projects.applied?.length > 3 && (
              <button className="see-more-btn" onClick={toggleShowApplied}>
                {showApplied ? "Show Less" : "See More"}
              </button>
            )}
          </div>

          {/* Assigned Employees Section */}
          <div className="employee-section">
            <h3 className="section-title">Assigned Employees</h3>
            <div className="employee-list assigned">
              {projects.assigned?.length === 0 ? (
                <p className="no-employees">No assigned employees for this project.</p>
              ) : (
                projects.assigned
                  .slice(0, showAssigned ? projects.assigned.length : 3)
                  .map((employee, idx) => (
                    <div
                      key={idx}
                      className="employee-card"
                      onClick={() => handleCardClick(employee)} // Handle card click
                    >
                      <div className="employee-avatar">
                        <Avatar
                          name={employee.employeeName}
                          src={employee.profilePhoto}
                          size="100"
                          round={true}
                          className="employee-img"
                        />
                      </div>
                      <div className="employee-info">
                        <h2>{employee.employeeName}</h2>
                        <p><strong>Location:</strong> {employee.address}</p>
                        <p><strong>Project:</strong> {employee.projectName}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
            {projects.assigned?.length > 3 && (
              <button className="see-more-btn" onClick={toggleShowAssigned}>
                {showAssigned ? "Show Less" : "See More"}
              </button>
            )}
          </div>

          {/* Matching Employees Section */}
          <div className="employee-section">
            <h3 className="section-title">Matching Employees</h3>
            <div className="employee-list matching">
              {projects.matching?.length === 0 ? (
                <p className="no-employees">No matching employees for this project.</p>
              ) : (
                projects.matching
                  .slice(0, showMatching ? projects.matching.length : 3)
                  .map((employee, idx) => (
                    <div
                      key={idx}
                      className="employee-card"
                      onClick={() => handleCardClick(employee)} // Handle card click
                    >
                      <div className="employee-avatar">
                        <Avatar
                          name={employee.employeeName}
                          src={employee.profilePhoto}
                          size="100"
                          round={true}
                          className="employee-img"
                        />
                      </div>
                      <div className="employee-info">
                        <h2>{employee.employeeName}</h2>
                        <p><strong>Location:</strong> {employee.address}</p>
                        <p><strong>Project:</strong> {employee.projectName}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
            {projects.matching?.length > 3 && (
              <button className="see-more-btn" onClick={toggleShowMatching}>
                {showMatching ? "Show Less" : "See More"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageEmployees;
