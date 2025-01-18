import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  projects: [],  // Initialisation de l'état des projets comme un tableau vide
  loading: false,
  error: null,
  selectedProjectId: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSelectedProjectId: (state, action) => {
      state.selectedProjectId = action.payload;
    },
  },
});

export const { setProjects, setLoading, setError, setSelectedProjectId } = projectSlice.actions;
export default projectSlice.reducer;
