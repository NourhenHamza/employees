import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    role: null, // Explicitly store the role
    error: null,
    message: null,
  },
  reducers: {
    // Registration actions
    registerRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.role = null;
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.user.role; // Set the role
      state.error = null;
      state.message = action.payload.message;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.role = null;
      state.error = action.payload;
      state.message = null;
    },

    // Login actions
    loginRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.role = null;
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.user.role; // Set the role
      state.error = null;
      state.message = action.payload.message;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.role = null;
      state.error = action.payload;
      state.message = null;
    },

    // Fetch User actions
    fetchUserRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.role = null;
      state.error = null;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.role = action.payload.role; // Set the role
      state.error = null;
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.role = null;
      state.error = action.payload;
    },

    // Logout actions
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = {};
      state.role = null;
      state.error = null;
    },
    logoutFailed(state, action) {
      state.error = action.payload;
    },

    // Clear all errors and messages
    clearErrorsAndMessages(state) {
      state.error = null;
      state.message = null;
    },
  },
});

// Register action
export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const response = await axios.post(
      "http://localhost:4000/api/v1/user/register",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(userSlice.actions.registerSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Registration failed";
    dispatch(userSlice.actions.registerFailed(errorMessage));
  }
};

// Login action
export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const response = await axios.post(
      "http://localhost:4000/api/v1/user/login",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(userSlice.actions.loginSuccess(response.data));
    localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    dispatch(userSlice.actions.loginFailed(errorMessage));
  }
};

// Get User action
export const getUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const response = await axios.get(
      "http://localhost:4000/api/v1/user/getuser",
      {
        withCredentials: true,
      }
    );
    dispatch(
      userSlice.actions.fetchUserSuccess({
        ...response.data.user,
        role: response.data.user.role, // Ensure role is included
      })
    );
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch user";
    dispatch(userSlice.actions.fetchUserFailed(errorMessage));
  }
};

// Logout action
export const logout = () => async (dispatch) => {
  try {
    await axios.get("http://localhost:4000/api/v1/user/logout", {
      withCredentials: true,
    });
    dispatch(userSlice.actions.logoutSuccess());
    localStorage.removeItem("loggedInUser");
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Logout failed";
    dispatch(userSlice.actions.logoutFailed(errorMessage));
  }
};

// Clear all errors
export const clearErrorsAndMessages = () => (dispatch) => {
  dispatch(userSlice.actions.clearErrorsAndMessages());
};

export default userSlice.reducer;