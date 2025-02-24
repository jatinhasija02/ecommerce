import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./userProfile.module.css";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const userID = sessionStorage.getItem("userID"); // Ensure userID is stored after login
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (userID) {
      // Fetch user details from backend
      axios
        .get(`http://localhost:9090/users/id/${userID}`)
        .then((res) => {
          console.log("User API Response:", res.data); // Debugging log
          setUserDetails(res.data);
        })
        .catch((err) => {
          console.error("Error fetching user details:", err);
        });
    }
  }, [userID]);

  // Navigate to edit profile page
  const handleEditUser = () => {
    navigate("/edituser");
  };

  // Navigate to Cart page
  const handleCart = () => {
    // When navigating to place an order for a product:
    navigate(`/cartpage/${userID}`);
  };

  // Navigate to Orders page
  const handleOrders = () => {
    navigate(`/orderpage/${userID}`);
  };

  return (
    <div className={styles.container}>
      {/* User Details Section */}
      <header className={styles.header}>
        <div className={styles.userDetails}>
          <h1>Welcome, {userDetails.name}</h1>
          <p>Email: {userDetails.email}</p>
          <p>Address: {userDetails.address}</p>
        </div>
        <div className={styles.buttons}>
          <button className={styles.editButton} onClick={handleEditUser}>
            Edit Profile
          </button>
          <button className={styles.cartButton} onClick={handleCart}>
            Cart
          </button>
          <button className={styles.ordersButton} onClick={handleOrders}>
            Orders
          </button>
        </div>
      </header>
    </div>
  );
};

export default UserProfile;
