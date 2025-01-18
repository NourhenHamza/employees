import { configureStore } from "@reduxjs/toolkit";
import adminReducer from './slices/adminSlice';
import applicationReducer from "./slices/applicationSlice";
import jobReducer from "./slices/jobSlice";
import ProjectReducer from "./slices/ProjectSlice";
import updateProfileReducer from "./slices/updateProfileSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    admin: adminReducer,
    user: userReducer,
    jobs: jobReducer,
    Projects:ProjectReducer,
    applications: applicationReducer,
    updateProfile: updateProfileReducer
  },
});

export default store;
