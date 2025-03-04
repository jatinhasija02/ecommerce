import React from "react";
import { Navigate } from "react-router-dom";

const UserPrivate = ({ children }) => {
  const userID = sessionStorage.getItem("userID")?.trim() || "";

  if (!userID) {
    console.warn("UserPrivate: No user ID found, redirecting...");
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default UserPrivate;
