import React, { useEffect, useState } from "react";
import "./ManageAdminEmployees.css";
import { axiosInstance } from "./utils/axiosInstance";

const ManageAdminEmployees = ({ projectId, handleCancelEmployeeManagement }) => {
  const [appliedEmployees, setAppliedEmployees] = useState([]);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [matchedEmployees, setMatchedEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        console.log("Fetching project data...");
        const response = await axiosInstance.get(`/projects/${projectId}`);
        const project = response.data;

        console.log("Project data fetched:", project);
        setMatchedEmployees(project.employeesMatched || []);
        setAssignedEmployees(project.employeesAssigned || []);

        console.log("Fetching applied employees...");
        const appliedResponse = await axiosInstance.get(`/applied/${projectId}`);
        console.log("Applied employees fetched:", appliedResponse.data);
        setAppliedEmployees(appliedResponse.data || []);
      } catch (error) {
        console.error("Error details:", error);
        console.error("Error response:", error.response?.data || "No response from server");
        alert(`Error fetching employees: ${error.response?.data?.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [projectId]);

  const handleAssignEmployee = async () => {
    if (!selectedEmployee) {
      alert("Please select an employee to assign.");
      return;
    }

    try {
      await axiosInstance.patch(`/projects/${projectId}/assign-employee`, {
        employeeId: selectedEmployee,
      });

      const response = await axiosInstance.get(`/projects/${projectId}`);
      const project = response.data;

      setAssignedEmployees(project.employeesAssigned || []);
      setAppliedEmployees((prev) => prev.filter((e) => e._id !== selectedEmployee));
      setSelectedEmployee("");

      alert("Employee assigned successfully!");
    } catch (error) {
      console.error("Error assigning employee:", error);
      alert("Unable to assign the employee. Please try again.");
    }
  };

  const handleRemoveEmployee = async (employeeId) => {
    try {
      await axiosInstance.patch(`/projects/${projectId}/remove-employee`, { employeeId });

      const response = await axiosInstance.get(`/projects/${projectId}`);
      const project = response.data;

      setAssignedEmployees(project.employeesAssigned || []);
      alert("Employee removed successfully!");
    } catch (error) {
      console.error("Error removing employee:", error);
      alert("Unable to remove the employee. Please try again.");
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-header">
        <h3>Manage Employees for Project</h3>
        <button onClick={handleCancelEmployeeManagement}>Close</button>
      </div>

      {loading ? (
        <div className="loading">Loading employees...</div>
      ) : (
        <>
          <div className="employee-section">
            <h4>Assign Employees to Project</h4>
            <div className="dropdown-container">
              <label htmlFor="employeeDropdown">Select Employee:</label>
              <select
                id="employeeDropdown"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">-- Select Employee --</option>
                {appliedEmployees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name} - {employee.email}
                  </option>
                ))}
              </select>
              <button onClick={handleAssignEmployee}>Assign</button>
            </div>
          </div>

          <div className="assigned-employees-section">
            <h4>Assigned Employees</h4>
            <div className="employees-grid">
              {assignedEmployees.map((employee) => (
                <div key={employee._id} className="employee-card">
                  <h5>{employee.name}</h5>
                  <p>{employee.email}</p>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveEmployee(employee._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="matched-employees-section">
            <h4>Matched Employees</h4>
            <div className="employees-grid">
              {matchedEmployees.map((employee) => (
                <div key={employee._id} className="employee-card">
                  <h5>{employee.name}</h5>
                  <p>{employee.email}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageAdminEmployees;