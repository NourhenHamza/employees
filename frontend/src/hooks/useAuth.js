// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Path to AuthContext

const useAuth = () => {
  return useContext(AuthContext); // Returns the current value of AuthContext
};

export default useAuth;
