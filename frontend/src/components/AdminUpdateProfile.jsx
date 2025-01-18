import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearAdminErrors, updateAdminProfile } from "../store/slices/adminSlice";

const AdminUpdateProfile = () => {
  const dispatch = useDispatch();
  const { admin, loading, error, message } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Populate form fields with current admin data
  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || "",
        phone: admin.phone || "",
        address: admin.address || "",
      });
    }
  }, [admin]);

  // Display error or success messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminErrors());
    }
    if (message) {
      toast.success(message);
    }
  }, [dispatch, error, message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateAdminProfile(formData)); // Dispatch action to update profile
  };

  return (
    <div className="update_profile">
      <h3>Update Profile</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default AdminUpdateProfile;
