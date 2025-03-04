import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";

const ProductOwnerPrivate = ({ children }) => {
  const productOwnerID = sessionStorage.getItem("productOwnerId")?.trim() || "";

  if (!productOwnerID) {
    console.warn(
      "ProductOwnerPrivate: No product owner ID found, redirecting..."
    );
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProductOwnerPrivate;
