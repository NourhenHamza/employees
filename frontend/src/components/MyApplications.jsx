import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./MyApplications.css";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const employeeId = loggedInUser?._id;

        if (!employeeId) {
          setError("No user found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:4000/api/Project/applications/${employeeId}`
        );

        if (response.data.length === 0) {
          setError("You have not applied for any projects. 🤷‍♀️");
        } else {
          setApplications(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Could not load your applications. 😞");
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress size={70} thickness={4} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="error-container">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="applications-container">
      <Typography variant="h3" className="header">
        My Applications 📝
      </Typography>
      <Typography variant="subtitle1" className="subtitle">
        Track your applied projects with ease. 🚀
      </Typography>

      {applications.length === 0 ? (
        <Alert severity="info">You have not applied for any projects. 😔</Alert>
      ) : (
        <Box className="cards-container">
          {applications.map((project) => {
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            const employeeId = loggedInUser?._id;

            const isAssigned = project.employeesAssigned.includes(employeeId);
            const applicationStatus = isAssigned
              ? "Assigned ✅"
              : "Pending Assignment ⏳";
            const statusColor = isAssigned ? "success" : "warning";

            return (
              <Card key={project._id} className="custom-card">
                <CardContent>
                  <Chip
                    label={applicationStatus}
                    color={statusColor}
                    className="status-chip"
                  />
                  <Typography variant="h5" className="project-name">
                    {project.name}
                  </Typography>
                  <Typography variant="body2" className="project-dates">
                    Applied On:{" "}
                    <strong>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </strong>
                  </Typography>
                  <Typography variant="body2" className="project-dates">
                    Deadline:{" "}
                    <strong>
                      {new Date(project.deadline).toLocaleDateString()}
                    </strong>
                  </Typography>
                  <Button
                    variant="contained"
                    className="details-btn"
                    onClick={() => console.log("View Details")}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default MyApplications;