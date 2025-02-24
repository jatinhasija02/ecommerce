import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";

const ProductOwnerPrivate = ({ children }) => {
  // Retrieve product owner ID from sessionStorage (set during login)
  const productOwnerID = (
    sessionStorage.getItem("productOwnerId") || ""
  ).trim();
  console.log("ProductOwnerPrivate: productOwnerId =", productOwnerID);

  // If a productOwnerId is present, render the children. Otherwise, redirect.
  return (
    <Fragment>{productOwnerID ? children : <Navigate to="/login" />}</Fragment>
  );
};

export default ProductOwnerPrivate;
