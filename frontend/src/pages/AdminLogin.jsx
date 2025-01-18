import { useEffect, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { adminLogin } from "../store/slices/adminSlice";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, isAuthenticated, error, admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(adminLogin({ email, password })); // Utiliser l'action
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (isAuthenticated) {
      navigate("/dashboard"); // Rediriger vers le tableau de bord de l'administrateur ou une autre page

      localStorage.setItem("loggedInUser", JSON.stringify(admin));
      
      // Force a browser refresh
      window.location.reload();
    }
  }, [dispatch, error, isAuthenticated, admin, navigate]);

  return (
    <section className="authPage">
      <div className="container login-container">
        <div className="header">
          <h3>Admin Login</h3>
        </div>
        <form onSubmit={handleLogin}>
          <div className="inputTag">
            <label>Email</label>
            <div>
              <input
                type="email"
                placeholder="youremail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <MdOutlineMailOutline />
            </div>
          </div>
          <div className="inputTag">
            <label>Password</label>
            <div>
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <RiLock2Fill />
            </div>
          </div>
          <button type="submit" disabled={loading}>
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;