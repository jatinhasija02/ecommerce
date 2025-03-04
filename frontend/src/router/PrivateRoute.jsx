import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAdmin = sessionStorage.getItem("adminId")?.trim();
  const isUser = sessionStorage.getItem("userID")?.trim();
  const isProductOwner = sessionStorage.getItem("userType")?.trim();

  if (isAdmin || isUser || isProductOwner) {
    return <>{children}</>;
  } else {
    console.warn("PrivateRoute: No valid access, redirecting...");
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
