import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearAllUpdateProfileErrors,
  updatePassword,
} from "../store/slices/updateProfileSlice";
import { getUser } from "../store/slices/userSlice";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import './UpdatePassword.css';  // Assuming your styles are in this file

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, isUpdated } = useSelector(
    (state) => state.updateProfile
  );

  const dispatch = useDispatch();

  const handleUpdatePassword = async () => {
    const formData = new FormData();
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);
  
    try {
      const response = await dispatch(updatePassword(formData)); // Dispatch Redux action
  
      if (response?.payload?.success) {
        toast.success(response.payload.message); // Show success message
        dispatch(getUser()); // Optionally fetch user data after updating the password
      }
    } catch (error) {
      // If there's an error, show an error message
      toast.error(error.message || "Something went wrong!");
    }
  };
  

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUpdateProfileErrors());
      if (isUpdated) {
        toast.success("Password Updated");
        dispatch(getUser());
        dispatch(clearAllUpdateProfileErrors());
      }
    }
  }, [dispatch, loading, error, isUpdated]);

  return (
    <div className="account_components update_password_component">
      <h3 className="heading">Update Password</h3>
      <div className="input_group">
        <label>Current Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="input_field"
        />
        {showPassword ? (
          <FaRegEyeSlash
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <FaEye
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      <div className="input_group">
        <label>New Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input_field"
        />
        {showPassword ? (
          <FaRegEyeSlash
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <FaEye
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      <div className="input_group">
        <label>Confirm Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input_field"
        />
        {showPassword ? (
          <FaRegEyeSlash
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <FaEye
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      <div className="save_change_btn_wrapper">
        <button
          className="btn blue_btn"
          onClick={handleUpdatePassword}
          disabled={loading}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default UpdatePassword;
