import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";
const AdminPrivate = ({ children }) => {
  const adminID = sessionStorage.getItem("adminID")?.trim() || "";

  if (!adminID) {
    console.warn("AdminPrivate: No admin ID found, redirecting...");
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminPrivate;
