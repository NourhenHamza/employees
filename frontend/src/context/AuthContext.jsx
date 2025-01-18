// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

// Create the context
export const AuthContext = createContext();

// AuthProvider component that provides the AuthContext to your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Simulating fetching user data (this can be from an API or localStorage)
  useEffect(() => {
    const fetchUser = () => {
      // Mock user data, you can replace this with actual API call
      setUser({
        role: "Job Seeker",  // Change this to "Employer" for non-job seekers
        name: "John Doe",
      });
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
