import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import React from "react";

const ProjectDetails = ({ project, setSelectedProject }) => {
  if (!project) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{
          backgroundColor: "#f4f7fc",
          textAlign: "center",
        }}
      >
        <Typography color="error" variant="h5">
          Project not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding="20px"
      sx={{ backgroundColor: "#f4f7fc" }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: "800px",
          boxShadow: 4,
          borderRadius: "16px",
          padding: "24px",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <CardContent>
          {/* Project Title */}
          <Typography variant="h4" fontWeight="700" gutterBottom>
            {project.name}
          </Typography>

          {/* Project Description */}
          <Box marginBottom={4}>
            <Typography variant="h6" fontWeight="600" color="primary" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {project.description || "No description provided."}
            </Typography>
          </Box>

          {/* Skills Required */}
          <Box marginBottom={4}>
            <Typography variant="h6" fontWeight="600" color="primary" gutterBottom>
              Required Skills
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {project.skillsRequired.map((skill, index) => (
                <Chip
                  key={index}
                  label={`${skill.name} (Min: ${skill.minCompetence}%)`}
                  sx={{
                    fontSize: "0.875rem",
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                    borderRadius: "12px",
                    paddingX: "8px",
                    "&:hover": {
                      backgroundColor: "#1976d2",
                      color: "#ffffff",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Deadline */}
          <Box>
            <Typography variant="h6" fontWeight="600" color="primary" gutterBottom>
              Deadline
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {new Date(project.deadline).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>

        {/* Actions */}
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={() => setSelectedProject(null)}
            sx={{
              paddingX: "24px",
              paddingY: "12px",
              fontSize: "1rem",
              borderRadius: "12px",
              textTransform: "none",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Back to Projects
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default ProjectDetails;