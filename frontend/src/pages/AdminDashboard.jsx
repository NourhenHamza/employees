
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminProfile from "../components/AdminProfile";
import AdminUpdateProfile from "../components/AdminUpdateProfile";
import { clearAdminErrors, logout } from "../store/slices/adminSlice";
import ManageQuizzes from "../components/ManageQuizzes";
import CreateTest from "../components/CreateTest"

const AdminDashboard = () => {
  const { isAuthenticated, error } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [activeTab, setActiveTab] = useState("profile"); // Default tab

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
    navigateTo("/");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminErrors());
    }
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, error, isAuthenticated, navigateTo]);

  return (
    <section className="dashboard">
      <div className="sidebar">
        <h3>Admin Dashboard</h3>
        <button onClick={() => setActiveTab("profile")}>My Profile</button>
        <button onClick={() => setActiveTab("update")}>Update Profile</button>
        <button onClick={() => setActiveTab("manage quizzes")}>Manage Quizzes</button>
        <button onClick={() => setActiveTab("add quizz")}>Add a Quizz</button>



        {/* New Button to View Job Seekers List */}
        <Link to="/Employers">
          <button>View Employers</button>
        </Link>

        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="content">
        {activeTab === "profile" && <AdminProfile />}
        {activeTab === "update" && <AdminUpdateProfile />}
        {activeTab === "manage quizzes" && <ManageQuizzes />}
        {activeTab === "add quizz" && <CreateTest />}



      </div>
    </section>
  );
};


export default AdminDashboard;
