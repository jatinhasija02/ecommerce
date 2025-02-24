import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";

const UserPrivate = ({ children }) => {
  const userID = (sessionStorage.getItem("userID") || "").trim();
  return <Fragment>{userID ? children : <Navigate to="/" />}</Fragment>;
};

export default UserPrivate;
