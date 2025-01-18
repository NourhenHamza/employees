import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state for profile updates
const updateProfileSlice = createSlice({
  name: "updateProfile",
  initialState: {
    loading: false,
    error: null,
    isUpdated: false,
  },
  reducers: {
    updateProfileRequest(state) {
      state.loading = true;
    },
    updateProfileSuccess(state) {
      state.error = null;
      state.loading = false;
      state.isUpdated = true;
    },
   
    updateProfileFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.isUpdated = false;
    },
    updatePasswordRequest(state) {
      state.loading = true;
    },
    updatePasswordSuccess(state) {
      state.error = null;
      state.loading = false;
      state.isUpdated = true;
    },
    updatePasswordFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.isUpdated = false;
    },
    profileResetAfterUpdate(state) {
      state.error = null;
      state.isUpdated = false;
      state.loading = false;
    },
  },
});

// Async action to update profile
export const updateProfile = (data) => async (dispatch) => {
  dispatch(updateProfileSlice.actions.updateProfileRequest());
  try {
    await axios.put("http://localhost:4000/api/v1/user/update/profile", data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    dispatch(updateProfileSlice.actions.updateProfileSuccess());

    const updatedUser = await fetchUser();  // Fetch updated user
    dispatch(fetchUpdatedUser(updatedUser)); // Add this action to update Redux state

  } catch (error) {
    dispatch(updateProfileSlice.actions.updateProfileFailed(
      error.response?.data?.message || "Failed to update profile."
    ));
  }
};

// Add action in slice to handle updated user data
export const fetchUpdatedUser = (user) => ({
  type: "user/fetchUpdatedUser",
  payload: user,
});



// Async action to update password
export const updatePassword = (data) => async (dispatch) => {
  dispatch(updateProfileSlice.actions.updatePasswordRequest());
  try {
    // Call the API to update the password
    await axios.put(
      "http://localhost:4000/api/v1/user/update/password",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    // Dispatch success action
    dispatch(updateProfileSlice.actions.updatePasswordSuccess());
  } catch (error) {
    dispatch(
      updateProfileSlice.actions.updatePasswordFailed(
        error.response?.data?.message || "Failed to update password."
      )
    );
  }
};

// Fetch the currently logged-in user's updated data
export const fetchUser = async () => {
  try {
    const response = await axios.get("http://localhost:4000/api/v1/user/me", {
      withCredentials: true,
    });
    return response.data.user;
  } catch (error) {
    console.error("Failed to fetch user data:", error.response?.data?.message);
    throw error; // Optional: throw if further handling is needed
  }
};

// Clear all errors and reset update state
export const clearAllUpdateProfileErrors = () => (dispatch) => {
  dispatch(updateProfileSlice.actions.profileResetAfterUpdate());
};

// Export the reducer
export default updateProfileSlice.reducer;
