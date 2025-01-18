import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PostAddIcon from "@mui/icons-material/PostAdd";
import QuizIcon from "@mui/icons-material/Quiz";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react"; // Importez useEffect
import { useSelector } from "react-redux";
import AddProject from "./AddProject"; // Importez AddProject
import './EmployerDashboard.css';
import SuggestQuiz from "./SuggestQuiz"; // Importez SuggestQuiz

const EmployerDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const [statistics, setStatistics] = useState({
    employersApplied: 0,
    matchesAssigned: 0,
    matchingEmployers: 0,
  });
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false); // Nouvel état pour afficher les quiz
  const [showProjectForm, setShowProjectForm] = useState(false); // Nouvel état pour afficher le formulaire de projet

  // Simulez le chargement des statistiques
  useEffect(() => {
    if (user) {
      const fetchStatistics = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/Project/recruiter/statistics/${user._id}`);
          const data = await response.json();
          if (response.ok) {
            setStatistics({
              employersApplied: data.employersApplied,
              matchesAssigned: data.matchesAssigned,
              matchingEmployers: data.matchingEmployers,
            });
          }
        } catch (error) {
          console.error("Error fetching statistics:", error);
        }
      };

      const fetchTotalQuizzes = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/test/recruiter/statistics/by-username/nourhen`);
          const data = await response.json();
          if (response.ok) {
            setTotalQuizzes(data.totalTests);
          }
        } catch (error) {
          console.error("Error fetching quiz statistics:", error);
        }
      };

      fetchStatistics();
      fetchTotalQuizzes();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <div className="header">
        <Box>
          <Typography variant="h5" className="section-title">
            Welcome back, {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
            Here’s an overview of your activity today.
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton className="icon-button">
            <NotificationsIcon />
          </IconButton>
          <Avatar
            src="https://via.placeholder.com/50"
            alt="Profile"
            className="avatar"
          />
        </Box>
      </div>

      {/* Si showQuiz est true, afficher le composant SuggestQuiz */}
      {showQuiz ? (
        <SuggestQuiz />
      ) : showProjectForm ? (
        <AddProject /> // Affiche AddProject si showProjectForm est true
      ) : (
        <>
          {/* Section des statistiques */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3} className="grid-item">
              <Card className="stats-card">
                <CardContent>
                  <PeopleAltIcon sx={{ fontSize: 40 }} />
                  <Typography variant="h5">{statistics.employersApplied}</Typography>
                  <Typography variant="body2">Employers Applied</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className="grid-item">
              <Card className="stats-card">
                <CardContent>
                  <QuizIcon sx={{ fontSize: 40 }} />
                  <Typography variant="h5">{totalQuizzes}</Typography>
                  <Typography variant="body2">Quizzes Conducted</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className="grid-item">
              <Card className="stats-card">
                <CardContent>
                  <PostAddIcon sx={{ fontSize: 40 }} />
                  <Typography variant="h5">{statistics.matchingEmployers}</Typography>
                  <Typography variant="body2">Matching Employers</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className="grid-item">
              <Card className="stats-card">
                <CardContent>
                  <PeopleAltIcon sx={{ fontSize: 40 }} />
                  <Typography variant="h5">{statistics.matchesAssigned}</Typography>
                  <Typography variant="body2">Matches Assigned</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Section des actions */}
          <Paper className="paper-action">
            <Typography className="section-title" variant="h5">
              Get Started
            </Typography>
            <Typography variant="body1" sx={{ color: "#7f8c8d", marginBottom: 2 }}>
              Let’s take the next steps to enhance your workflow.
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                className="styled-button"
                variant="contained"
                sx={{ backgroundColor: "#27ae60" }}
                onClick={() => setShowQuiz(true)} // Déclenche l'affichage de SuggestQuiz
              >
                Post a New Quiz
              </Button>
              <Button
                className="styled-button"
                variant="outlined"
                sx={{ color: "#2980b9" }}
                onClick={() => setShowProjectForm(true)} // Déclenche l'affichage de AddProject
              >
                Post a New Project
              </Button>
            </Box>
          </Paper>
        </>
      )}

      {/* Section Footer */}
      <Paper className="paper-footer">
        <Typography className="section-title" variant="h6">
          Recent Activities
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
              ✔️ You successfully matched 5 candidates to jobs this week.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
              ✔️ Updated the quiz for “Frontend Developer” role.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default EmployerDashboard;
