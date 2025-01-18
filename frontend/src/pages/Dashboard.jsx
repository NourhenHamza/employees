import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// Import Components
import Applications from "../components/Applications"; // Applications Component
import CreateTest from "../components/CreateTest"; // For "Add a Quiz"
import Dashboardd from "../components/Dashboard"; // Dashboard Component
import EmployersList from "../components/EmployersList"; // Employers List Component
import ManageAdminEmployees from "../components/ManageAdminEmployees";
import ManageEmployees from "../components/ManageEmployees";
import ManageProjects from "../components/ManageProjects"; // Manage Projects Component
import ManageQuizzes from "../components/ManageQuizzes"; // Admin-specific Component
import ManageUsers from "../components/ManageUsers"; // User Management Component
import MyApplications from "../components/MyApplications"; // My Applications Component
import MyJobs from "../components/MyJobs"; // My Jobs Component
import MyProfile from "../components/MyProfile"; // My Profile Component
import MyProjects from "../components/MyProjects"; // My Projects Component
import Projects from "../components/Projects"; // Projects Component
import QuizSuggestions from "../components/QuizSuggestions"; // Quiz Suggestions Component
import Quizzes from "../components/Quizzes"; // Quiz Component
import Skills from "../components/Skills"; // Skills Component
import SuggestQuiz from "../components/SuggestQuiz"; // Suggest a Quiz Component
import UpdatePassword from "../components/UpdatePassword"; // Update Password Component
import ViewTest from "../components/ViewTest"; // View Test Component
import { logout } from "../store/slices/userSlice";

const Dashboard = () => {
  const [componentName, setComponentName] = useState("Dashboard");
  const { isAuthenticated, error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("loggedInUser");
    toast.success("Logged out successfully.");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [error, isAuthenticated, navigateTo]);

  const renderContent = () => {
    switch (componentName) {
      case "Dashboard":
        return <Dashboardd />;
      case "My Profile":
        return <MyProfile />;
      case "Update Password":
        return <UpdatePassword />;
      case "Manage Skills":
        return <Skills />;
      case "Job Post":
        return <MyJobs />;
      case "Applications":
        return <Applications />;
      case "My Applications":
        return <MyApplications />;
      case "My Projects":
        return <MyProjects />;
      case "Suggest Quiz":
        return <SuggestQuiz />;
      case "View Test":
        return <ViewTest />;
      case "Quizzes":
        return <Quizzes />;
      case "Manage Projects":
        return <ManageProjects />;
      case "Manage Quizzes":
        return <ManageQuizzes />;
      case "Add Quiz":
        return <CreateTest />;
      case "Quiz Suggestions":
        return <QuizSuggestions />;
      case "Employers":
        return <EmployersList />;
      case "Manage Users":
        return <ManageUsers />;
      case "Projects":
        return <Projects />;
        case "Manage Admin Employees":
          return <ManageAdminEmployees />;
          case "Manage Employees":
          return <ManageEmployees />;
      default:
        return <MyProfile />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Navigation */}
      <Box
        sx={{
          width: 320,
          bgcolor: "#2c3e50",
          color: "#fff",
          height: "100vh",
          padding: 2,
        }}
      >
        <List>
          <ListItem
            button
            onClick={() => setComponentName("Dashboard")}
            selected={componentName === "Dashboard"}
          >
            <ListItemText primary="Dashboard" />
          </ListItem>
          <Divider sx={{ bgcolor: "#7f8c8d", marginY: 2 }} />
          <Typography variant="h6" sx={{ color: "#fff", paddingLeft: 1 }}>
            Manage Account
          </Typography>
          <ListItem
            button
            onClick={() => setComponentName("My Profile")}
            selected={componentName === "My Profile"}
          >
            <ListItemText primary="My Profile" />
          </ListItem>
          <ListItem
            button
            onClick={() => setComponentName("Update Password")}
            selected={componentName === "Update Password"}
          >
            <ListItemText primary="Update Password" />
          </ListItem>

          {user && user.role === "Job Seeker" && (
            <>
              <ListItem
                button
                onClick={() => setComponentName("Manage Skills")}
                selected={componentName === "Manage Skills"}
              >
                <ListItemText primary="Manage Skills" />
              </ListItem>
              <Divider sx={{ bgcolor: "#7f8c8d", marginY: 2 }} />
              <Typography variant="h6" sx={{ color: "#fff", paddingLeft: 1 }}>
                Actions
              </Typography>
              <ListItem
                button
                onClick={() => setComponentName("My Applications")}
                selected={componentName === "My Applications"}
              >
                <ListItemText primary="My Applications" />
              </ListItem>
              <ListItem
                button
                onClick={() => setComponentName("My Projects")}
                selected={componentName === "My Projects"}
              >
                <ListItemText primary="My Projects" />
              </ListItem>
            </>
          )}

          {user && user.role === "Employer" && (
            <>
              <Divider sx={{ bgcolor: "#7f8c8d", marginY: 2 }} />
              <Typography variant="h6" sx={{ color: "#fff", paddingLeft: 1 }}>
                Employer Actions
              </Typography>
              <ListItem
                button
                onClick={() => setComponentName("Manage Projects")}
                selected={componentName === "Manage Projects"}
              >
                <ListItemText primary="Manage Projects" />
              </ListItem>
              <ListItem
                button
                onClick={() => setComponentName("Manage Employees")}
                selected={componentName === "Manage Employees"}
              >
                <ListItemText primary="Manage Employees" />
              </ListItem>
              <ListItem
                button
                onClick={() => setComponentName("Quizzes")}
                selected={componentName === "Quizzes"}
              >
                <ListItemText primary="Manage Quizzes" />
              </ListItem>
              <ListItem
                button
                onClick={() => setComponentName("Suggest Quiz")}
                selected={componentName === "Suggest Quiz"}
              >
                <ListItemText primary="Suggest a Quiz" />
              </ListItem>
              
            </>
          )}

          {user && user.role === "admin" && (
            <>
              <Divider sx={{ bgcolor: "#7f8c8d", marginY: 2 }} />
              <Typography variant="h6" sx={{ color: "#fff", paddingLeft: 1 }}>
                Admin Actions
              </Typography>
              <ListItem
                button
                onClick={() => setComponentName("Manage Quizzes")}
                selected={componentName === "Manage Quizzes"}
              >
                <ListItemText primary="Manage Quizzes" />
              </ListItem>
              <ListItem
                button
                onClick={() => setComponentName("Add Quiz")}
                selected={componentName === "Add Quiz"}
              >
                <ListItemText primary="Add a Quiz" />
              </ListItem>
              <ListItem
                button
                onClick={() => setComponentName("Quiz Suggestions")}
                selected={componentName === "Quiz Suggestions"}
              >
                <ListItemText primary="Quiz Suggestions" />
              </ListItem>
              <ListItem
                button
                onClick={() => setComponentName("Employers")}
                selected={componentName === "Employers"}
              >
                <ListItemText primary="Employers" />
              </ListItem>
              <ListItem
                button
                onClick={() => setComponentName("Projects")}
                selected={componentName === "Projects"}
              >
                <ListItemText primary="Projects" />
              </ListItem>
              <ListItem
                button
                onClick={() => setComponentName("Manage Users")}
                selected={componentName === "Manage Users"}
              >
                <ListItemText primary="Manage Users" />
              </ListItem>
              <ListItem
  button
  onClick={() => setComponentName("Manage Admin Employees")}
  selected={componentName === "Manage Admin Employees"}
>
  <ListItemText primary="Manage Employees" />
</ListItem>

            </>
          )}
        </List>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ width: "100%", marginTop: 2 }}
        >
          Logout
        </Button>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {renderContent()}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
