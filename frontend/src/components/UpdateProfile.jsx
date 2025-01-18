import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearAllUpdateProfileErrors,
  updateProfile,
} from "../store/slices/updateProfileSlice";




const UpdateProfile = () => {
  const { user } = useSelector((state) => state.user);
  const { loading, error, isUpdated } = useSelector(
    (state) => state.updateProfile
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State Management
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [phone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [coverLetter, setCoverLetter] = useState(user?.coverLetter || "");
  const [firstNiche, setFirstNiche] = useState(user?.niches?.firstNiche || "");
  const [secondNiche, setSecondNiche] = useState(user?.niches?.secondNiche || "");
  const [thirdNiche, setThirdNiche] = useState(user?.niches?.thirdNiche || "");
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState(user?.resume?.url || "");

  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    if (user?.role === "Job Seeker") {
      formData.append("firstNiche", firstNiche);
      formData.append("secondNiche", secondNiche);
      formData.append("thirdNiche", thirdNiche);
      formData.append("coverLetter", coverLetter);
    }
    if (resume) {
      formData.append("resume", resume);
    }
  
    // Ensure to await or catch error if needed
    dispatch(updateProfile(formData));
  };
  

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUpdateProfileErrors());
    }
    if (isUpdated) {
      toast.success("Profile Updated.");
      dispatch(clearAllUpdateProfileErrors());
    }
  }, [dispatch, error, isUpdated, navigate]);

  // Resume file handler
  const resumeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      const reader = new FileReader();
      reader.onload = () => {
        setResumePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setResumePreview("");  // Reset preview if no file is selected
    }
  };
  

  const nichesArray = [
    "Software Development", "Web Development", "Cybersecurity", "Data Science",
    "Artificial Intelligence", "Cloud Computing", "DevOps", "Mobile App Development",
    "Blockchain", "Database Administration", "Network Administration", "UI/UX Design",
    "Game Development", "IoT (Internet of Things)", "Big Data", "Machine Learning",
    "IT Project Management", "IT Support and Helpdesk", "Systems Administration", "IT Consulting"
  ];

  return (
    <div className="account_components">
      <h3 style={{ color: "#1976d2" }}>Update Profile</h3>
      <div>
        <label>Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          readOnly
          style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
        />
      </div>
      <div>
        <label>Phone Number</label>
        <input
          type="number"
          value={phone}
          readOnly
          style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
        />
      </div>
      <div>
        <label>Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {user?.role === "Job Seeker" && (
        <>
          <div>
            <label>My Preferred Job Niches</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <select
                value={firstNiche}
                onChange={(e) => setFirstNiche(e.target.value)}
              >
                {nichesArray.map((element, index) => (
                  <option value={element} key={index}>
                    {element}
                  </option>
                ))}
              </select>
              <select
                value={secondNiche}
                onChange={(e) => setSecondNiche(e.target.value)}
              >
                {nichesArray.map((element, index) => (
                  <option value={element} key={index}>
                    {element}
                  </option>
                ))}
              </select>
              <select
                value={thirdNiche}
                onChange={(e) => setThirdNiche(e.target.value)}
              >
                {nichesArray.map((element, index) => (
                  <option value={element} key={index}>
                    {element}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label>Cover Letter</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
            />
          </div>
          <div>
            <label>Upload Resume</label>
            <input type="file" onChange={resumeHandler} />
            {resumePreview && (
              <div>
                <p>Resume Preview:</p>
                <iframe
                  src={resumePreview}
                  title="Resume Preview"
                  width="100%"
                  height="500px"
                />
              </div>
            )}
            {user?.resume && !resume && (
              <div>
                <p>Current Resume:</p>
                <Link to={user.resume.url} target="_blank" className="view-resume">
                  View Resume
                </Link>
              </div>
            )}
          </div>
        </>
      )}
      <div className="save_change_btn_wrapper">
        <button
          className="btn"
          onClick={handleUpdateProfile}
          disabled={loading}
          style={{ backgroundColor: "#1976d2", color: "white" }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;