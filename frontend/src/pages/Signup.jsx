import React, { useState } from "react";
import styles from "./signup.module.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [signupuser, setSignupuser] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
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

  const signupFormSubmit = (e) => {
    e.preventDefault();
    if (signupuser.agreement) {
      axios
        .post("http://localhost:9090/users/register", signupuser, {
          headers: { "Content-Type": "application/json" },
        })
        .then(() => {
          toast.success("Signup successful");
          // Clear fields
          setSignupuser({
            name: "",
            email: "",
            password: "",
            phoneNumber: "",
            address: "",
            agreement: false,
          });
          navigate("/login"); // Navigate to login page
        })
        .catch((err) => {
          console.error("Error:", err.response);
          toast.error("Something went wrong during signup");
        });
    } else {
      toast.error("Please accept the agreement");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Signup</h1>
        <form onSubmit={signupFormSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter name"
              value={signupuser.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={signupuser.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={signupuser.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter phone number"
              minLength={10}
              maxLength={10}
              value={signupuser.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter address"
              value={signupuser.address}
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

export default Signup;
