// Dashboard.js
import { Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import EmployerDashboard from "./EmployerDashboard";
import JobSeekerDashboard from "./JobSeekerDashboard";

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);

  // Load the user's role from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.role); // Set role dynamically
    }
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser"); // Clear user data
    setUserRole(null); // Reset role in state
    alert("Logged out successfully!");
  };

  return (
    <Paper
      sx={{
        padding: 4,
        marginTop: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
    

      {/* Display content based on user role */}
      {userRole === "Job Seeker" && <JobSeekerDashboard />}
      {userRole === "Employer" && <EmployerDashboard />}

      {/* If no role is set, show a default message */}
      {!userRole && (
        <Typography variant="body1" sx={{ textAlign: "center", marginTop: 2 }}>
          Please log in to see your personalized dashboard.
        </Typography>
      )}

      
    </Paper>
  );
};

export default Dashboard;
