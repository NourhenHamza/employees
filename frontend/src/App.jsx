import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import AddProject from "./components/AddProject";
import ConfirmedEmployerDetail from './components/ConfirmedEmployerDetail';
import CreateTest from "./components/CreateTest";
import EditEmployer from './components/EditEmployer';
import EditProject from "./components/EditProject";
import EditTest from "./components/EditTest";
import EmployersList from "./components/EmployersList";
import Footer from "./components/Footer";
import ManageEmployees from "./components/ManageEmployees";
import ManageProjects from "./components/ManageProjects";
import ManageQuizzes from "./components/ManageQuizzes";
import MyProjects from './components/MyProjects';
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import ProjectDetails from "./components/ProjectDetails";
import Quizzes from "./components/Quizzes";
import SuggestQuiz from "./components/SuggestQuiz";
import TakeTest from "./components/TakeTest";
import UserInfo from "./components/UserInfo";
import ViewProject from "./components/ViewProject";
import ViewTest from "./components/ViewTest";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import EmployerForm from './pages/EmployerForm';
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PostApplication from "./pages/PostApplication";
import Register from "./pages/Register";
import { getUser } from "./store/slices/userSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/admin/view-test/:id" element={<ViewTest />} />
          <Route path="/admin/edit-test/:id" element={<EditTest />} />
          <Route path="/dashboard" element={<Dashboard />} >
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="suggest-quiz" element={<SuggestQuiz />} />
            <Route path="manage-projects" element={<ManageProjects />} />
            <Route path="manage-projects/add" element={<AddProject />} />
            

            <Route path="projects/:projectId/employees" element={<ManageEmployees />} />
          </Route>
          <Route path="/admin" element={<Dashboard />} >
            <Route path="manage-quizzes" element={<ManageQuizzes />} />
            <Route path="create-test" element={<CreateTest />} />
          </Route>
          <Route path="/post/application/:jobId" element={<PostApplication />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />

          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/edit/:id" element={<EditProject />} />
          <Route path="/projects/:projectId" element={<ViewProject />} />
          <Route path="/Projects/view/:projectId" element={<ProjectDetails />} />

          <Route path="/user-info" element={<UserInfo />} />
          <Route path="/Employers" element={<EmployersList />} />
          <Route path="/confirmed-employer/:id" element={<ConfirmedEmployerDetail />} />
          <Route path="/edit-employer/:id" element={<EditEmployer />} />
          <Route path="/Employer-form" element={<EmployerForm />} />
          <Route path="/Employer-form/:EmployerId" element={<EmployerForm />} />
          <Route path="/my-projects" element={<MyProjects />} />
          <Route path="/taketest/:testID" element={<TakeTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-right" theme="dark" />
      </Router>
    </>
  );
};

export default App;
