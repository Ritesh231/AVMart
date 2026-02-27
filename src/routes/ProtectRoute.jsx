import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("Admin_token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Optional: Check token expiry (if JWT)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("Admin_token");
      localStorage.removeItem("admin");
      return <Navigate to="/" replace />;
    }
  } catch (err) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;