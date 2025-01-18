import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QuizIcon from '@mui/icons-material/Quiz';
import StarIcon from '@mui/icons-material/Star';
import './Dashboard.css';
import MyApplications from './MyApplications'; // Import MyApplications component

const JobSeekerDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const [statistics, setStatistics] = useState({
    projectsApplied: 0,
    testsCompleted: 0,
    matchingProjects: 0,
    skills: [],
  });
  const [totalTests, setTotalTests] = useState(0);
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [showMyApplications, setShowMyApplications] = useState(false); // State for conditional rendering

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Fetch Job Seeker's Statistics
      
      const fetchStatistics = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/jobseeker/statistics/${user._id}`);
          const data = await response.json();
          if (response.ok) {
            setStatistics({
              projectsApplied: data.projectsApplied,
              testsCompleted: data.testsCompleted,
              matchingProjects: data.matchingProjects,
              skills: data.skills, // Skill set data
            });
            setAppliedProjects(data.appliedProjects); // Applied projects data
          } else {
            console.error('Failed to fetch statistics:', data.message);
          }
        } catch (error) {
          console.error('Error fetching statistics:', error);
        }
      };

      fetchStatistics();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="dashboard-container">
      {showMyApplications ? (
        // Show only MyApplications component when state is true
        <MyApplications appliedProjects={appliedProjects} />
      ) : (
        <>
          <div className="header">
            <Box>
              <Typography variant="h5" className="section-title">
                Welcome back, {user.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                Here’s an overview of your job-seeking progress today.
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton className="icon-button">
                <AssignmentIcon />
              </IconButton>
              <Avatar
                src="https://via.placeholder.com/50"
                alt="Profile"
                className="avatar"
              />
            </Box>
          </div>

          {/* Statistics Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="stats-card">
                <CardContent>
                  <PeopleAltIcon sx={{ fontSize: 40, color: '#2980b9' }} />
                  <Typography variant="h5">{statistics.projectsApplied}</Typography>
                  <Typography variant="body2">Projects Applied</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className="stats-card">
                <CardContent>
                  <QuizIcon sx={{ fontSize: 40, color: '#e67e22' }} />
                  <Typography variant="h5">{statistics.testsCompleted}</Typography>
                  <Typography variant="body2">Tests Taken</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className="stats-card">
                <CardContent>
                  <CheckCircleIcon sx={{ fontSize: 40, color: '#27ae60' }} />
                  <Typography variant="h5">{statistics.matchingProjects}</Typography>
                  <Typography variant="body2">Matching Projects</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card className="stats-card">
                <CardContent>
                  <StarIcon sx={{ fontSize: 40, color: '#f39c12' }} />
                  <Typography variant="h5">{statistics.skills.length}</Typography>
                  <Typography variant="body2">Skills Acquired</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Applied Projects Section */}
          <Paper className="paper-action">
            <Typography className="section-title" variant="h5">
              Applied Projects
            </Typography>
            <Typography variant="body1" sx={{ color: '#7f8c8d', marginBottom: 2 }}>
              See the status of your applications and projects you're matched with.
            </Typography>
            <Grid container spacing={2}>
              {appliedProjects.map((project, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card className="project-card">
                    <CardContent>
                      <Typography variant="h6">{project.name}</Typography>
                      <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                        {project.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{ marginTop: 2 }}
                        onClick={() => setShowMyApplications(true)} // Show MyApplications component
                      >
                        View My Applications
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Skills Management Section */}
          <Paper className="paper-action">
            <Typography className="section-title" variant="h5">
              Manage Your Skills
            </Typography>
            <Typography variant="body1" sx={{ color: '#7f8c8d', marginBottom: 2 }}>
              Enhance your profile by taking more tests.
            </Typography>
            <Grid container spacing={2}>
              {statistics.skills.map((skill, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card className="skill-card">
                    <CardContent>
                      <Typography variant="h6">{skill.name}</Typography>
                      <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                        Level: {skill.level}
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{ marginTop: 2 }}
                        onClick={() => navigate(`/take-test/${skill.id}`)}
                      >
                        Take Test
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Footer Section */}
          <Paper className="paper-footer">
            <Typography className="section-title" variant="h6">
              Recent Activities
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                  ✔️ Applied to 3 new projects this week.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                  ✔️ Completed the Frontend Developer Quiz.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </div>
  );
};

export default JobSeekerDashboard;
