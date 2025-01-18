import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/v1", // Adjust to match your backend server's address
  timeout: 10000,
  withCredentials: true, // Include this if you're using cookies or sessions
});
