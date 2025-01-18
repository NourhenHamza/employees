import { useEffect, useState } from "react"; // Keep React import for JSX
import { FaAddressBook, FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../store/slices/userSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

 

  const { loading, isAuthenticated, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Prepare form data for registration
    const formData = new FormData();
    formData.append("role", "Job Seeker");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("password", password);
    formData.append("coverLetter", coverLetter);

    // Dispatch registration action
    dispatch(register(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (isAuthenticated) {
      navigate("/"); // Redirect to home page after successful registration
    }
  }, [error, isAuthenticated, navigate]);

  return (
    <section
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
    padding: "20px",
  }}
>
<div
  style={{
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    marginTop: "860px", // Corrected to camelCase
  }}
>


    {/* Header */}
    <div style={{ marginBottom: "20px", textAlign: "center" }}>
      <h3 style={{ margin: 0, fontSize: "1.5rem", color: "#333" }}>
        Create a new account
      </h3>
    </div>

    {/* Form */}
    <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column" }}>
      {/* Wrapper for each field */}
      {[
        {
          label: "Your Name",
          type: "text",
          placeholder: "Your Name",
          value: name,
          onChange: (e) => setName(e.target.value),
          icon: <FaPencilAlt />,
        },
        {
          label: "Email Address",
          type: "email",
          placeholder: "youremail@gmail.com",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          icon: <MdOutlineMailOutline />,
        },
        {
          label: "Phone Number",
          type: "text",
          placeholder: "111-222-333",
          value: phone,
          onChange: (e) => setPhone(e.target.value),
          icon: <FaPhoneFlip />,
        },
        {
          label: "Address",
          type: "text",
          placeholder: "Your Address",
          value: address,
          onChange: (e) => setAddress(e.target.value),
          icon: <FaAddressBook />,
        },
        {
          label: "Password",
          type: "password",
          placeholder: "Your Password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          icon: <RiLock2Fill />,
        },
        {
          label: "Confirm Password",
          type: "password",
          placeholder: "Confirm Your Password",
          value: confirmPassword,
          onChange: (e) => setConfirmPassword(e.target.value),
          icon: <RiLock2Fill />,
        },
      ].map((field, index) => (
        <div
          key={index}
          style={{
            marginBottom: "15px",
          }}
        >
          <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>
            {field.label}
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={field.value}
              onChange={field.onChange}
              style={{
                flex: 1,
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                outline: "none",
              }}
            />
            <span style={{ marginLeft: "10px", color: "#888" }}>{field.icon}</span>
          </div>
        </div>
      ))}

      {/* Cover Letter */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>
          Cover Letter
        </label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={10}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            outline: "none",
          }}
        />
      </div>

     
      {/* Buttons */}
      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: "#007BFF",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          fontSize: "1rem",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        Register
      </button>
      <Link
        to={"/login"}
        style={{
          color: "#007BFF",
          textDecoration: "none",
          textAlign: "center",
          display: "block",
        }}
      >
        Login Now
      </Link>
    </form>
  </div>
</section>

  );
};

export default Register;
