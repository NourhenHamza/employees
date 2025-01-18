import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch job seekers from the API
export const fetchJobSeekers = createAsyncThunk(
  "jobSeeker/fetchJobSeekers",
  async () => {
    try {
      const response = await axios.get("/api/job-seekers"); // Adjust API endpoint if needed
      return response.data; // Assuming the response contains the list of job seekers
    } catch (error) {
      throw new Error(error.message || "Failed to fetch job seekers");
    }
  }
);

const jobSeekerSlice = createSlice({
  name: "jobSeeker",
  initialState: {
    jobSeekersData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobSeekers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobSeekers.fulfilled, (state, action) => {
        state.loading = false;
        state.jobSeekersData = action.payload;
      })
      .addCase(fetchJobSeekers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default jobSeekerSlice.reducer;
