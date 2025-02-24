import React, { useState } from "react";
import styles from "./signup.module.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignupProductOwner = () => {
  const [signupuser, setSignupuser] = useState({
    productOwnerName: "",
    productOwnerEmail: "",
    productOwnerPassword: "",
    productOwnerNumber: "",
    agreement: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupuser({
      ...signupuser,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const signupFormSubmit = async (e) => {
    e.preventDefault();

    if (!signupuser.agreement) {
      toast.error("Please accept the agreement");
      return;
    }

    const signupData = {
      productOwnerName: signupuser.productOwnerName,
      productOwnerEmail: signupuser.productOwnerEmail,
      productOwnerPassword: signupuser.productOwnerPassword,
      productOwnerNumber: Number(signupuser.productOwnerNumber),
    };

    // Log the payload for debugging
    console.log("Signup Payload:", signupData);

    try {
      await axios.post(
        "http://localhost:9090/product-owners/register",
        signupData,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Signup successful!");
      // Clear form data after signup
      setSignupuser({
        productOwnerName: "",
        productOwnerEmail: "",
        productOwnerPassword: "",
        productOwnerNumber: "",
        agreement: false,
      });
      navigate("/login");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error(
        "Signup failed: " + (error.response?.data || "Something went wrong")
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Product Owner Signup</h1>
        <form onSubmit={signupFormSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="productOwnerName">Name</label>
            <input
              type="text"
              id="productOwnerName"
              name="productOwnerName"
              placeholder="Enter name"
              value={signupuser.productOwnerName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="productOwnerEmail">Email</label>
            <input
              type="email"
              id="productOwnerEmail"
              name="productOwnerEmail"
              placeholder="Enter email"
              value={signupuser.productOwnerEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="productOwnerPassword">Password</label>
            <input
              type="password"
              id="productOwnerPassword"
              name="productOwnerPassword"
              placeholder="Enter password"
              value={signupuser.productOwnerPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="productOwnerNumber">Phone Number</label>
            <input
              type="tel"
              id="productOwnerNumber"
              name="productOwnerNumber"
              placeholder="Enter phone number"
              minLength={10}
              maxLength={10}
              value={signupuser.productOwnerNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="agreement"
              onChange={handleChange}
              checked={signupuser.agreement}
            />
            <span>Agree & Continue</span>
          </div>
          <button type="submit" className={styles.submitButton}>
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupProductOwner;
