import React, { Fragment, useState, useEffect } from "react";
import style from "./navbar.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState({
    userID: sessionStorage.getItem("userID"),
    productOwnerId: sessionStorage.getItem("productOwnerId"),
    adminId: sessionStorage.getItem("adminId"), // Added for admin login
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Re-read session storage whenever the route changes
    setLoggedIn({
      userID: sessionStorage.getItem("userID"),
      productOwnerId: sessionStorage.getItem("productOwnerId"),
      adminId: sessionStorage.getItem("adminId"),
    });
  }, [location]);

  const logout = () => {
    if (loggedIn.productOwnerId) {
      sessionStorage.removeItem("productOwnerId");
    }
    if (loggedIn.userID) {
      sessionStorage.removeItem("userID");
    }
    if (loggedIn.adminId) {
      sessionStorage.removeItem("adminId");
    }
    toast.success("Logged out");
    setLoggedIn({ userID: null, productOwnerId: null, adminId: null });
    navigate("/");
  };

  // Determine profile route based on login type
  let profileRoute = "";
  if (loggedIn.adminId) {
    profileRoute = "/admindashboard";
  } else if (loggedIn.productOwnerId) {
    profileRoute = "/productlist";
  } else if (loggedIn.userID) {
    profileRoute = "/userprofile";
  }

  return (
    <nav id={style.nav}>
      <figure>
        <img src="/flash.png" alt="flash-logo" title="flash" />
      </figure>
      <ul>
        <div className="left-links">
          <li className="link-btn">
            <Link to="/">home</Link>
          </li>
        </div>
        <div className="right-links">
          {loggedIn.productOwnerId || loggedIn.userID || loggedIn.adminId ? (
            <Fragment>
              <li>
                <Link to={profileRoute}>Profile</Link>
              </li>
              <li className="primary-btn" onClick={logout}>
                Logout
              </li>
            </Fragment>
          ) : (
            <Fragment>
              <li className="primary-btn">
                <Link to="/login">login</Link>
              </li>
              <li className="primary-btn">
                <Link to="/SignupProductOwner">Seller</Link>
              </li>
              <li className="secondary-btn">
                <Link to="/signup">signup</Link>
              </li>
            </Fragment>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
