import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    loading: false,
    isAuthenticated: false,
    error: null,
    message: null,
    admin: {}, // Admin data storage
  },
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.admin = {};
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.admin = action.payload.admin;
      state.error = null;
      state.message = action.payload.message;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.admin = {};
      state.error = action.payload;
      state.message = null;
    },
    logoutRequest(state) {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.admin = {};
      state.error = null;
      state.message = "Logged out successfully";
    },
    clearAdminErrors(state) {
      state.error = null;
      state.message = null;
    },
    updateAdminProfileRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updateAdminProfileSuccess(state, action) {
      state.loading = false;
      state.admin = { ...state.admin, ...action.payload };
      state.error = null;
      state.message = "Profile updated successfully";
    },
    updateAdminProfileFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchadminRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.admin = {};
      state.role = null;
      state.error = null;
    },
    fetchadminSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.admin = action.payload;
      state.role = action.payload.role; // Set the role
      state.error = null;
    },
    fetchadminFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.admin = {};
      state.role = null;
      state.error = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailed,
  logoutRequest,
  logoutSuccess,
  clearAdminErrors,
  updateAdminProfileRequest,
  updateAdminProfileSuccess,
  updateAdminProfileFailed,
} = adminSlice.actions;

// Action for admin login
export const adminLogin = (data) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await axios.post(
      'http://localhost:4000/api/admin/login',
      data,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    dispatch(loginSuccess(response.data));
    localStorage.setItem("loggedInadmin", JSON.stringify(response.data.admin));

  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    dispatch(loginFailed(errorMessage));
  }
};

// Action for logout
export const logout = () => async (dispatch) => {
  dispatch(logoutRequest());
  try {
    await axios.get('http://localhost:4000/api/admin/logout', {
      withCredentials: true,
    });
    dispatch(logoutSuccess());
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Logout failed';
    dispatch(loginFailed(errorMessage));
  }
};




// Action for updating admin profile
export const updateAdminProfile = (data) => async (dispatch) => {
  dispatch(updateAdminProfileRequest());
  try {
    const response = await axios.put(
      'http://localhost:4000/api/admin/profile',
      data,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    dispatch(updateAdminProfileSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Profile update failed';
    dispatch(updateAdminProfileFailed(errorMessage));
  }
};

export default adminSlice.reducer;