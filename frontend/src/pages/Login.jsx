import React, { useState } from "react";
import styles from "./login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting login data:", formData);

    try {
      const response = await axios.post(
        "http://localhost:9090/auth/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Login response data:", response.data);

      const { type, id, message } = response.data;

      if (type === "PRODUCT_OWNER") {
        sessionStorage.setItem("userType", "PRODUCT_OWNER");
        sessionStorage.setItem("productOwnerId", id);
        toast.success("Login successful! Redirecting...");
        navigate("/productlist");
      } else if (type === "USER") {
        sessionStorage.setItem("userType", "USER");
        sessionStorage.setItem("userID", id);
        toast.success("Login successful! Redirecting...");
        navigate("/userprofile");
      } else if (type === "ADMIN") {
        sessionStorage.setItem("userType", "ADMIN");
        sessionStorage.setItem("adminId", id);
        toast.success("Login successful! Redirecting...");
        navigate("/admindashboard");
      } else {
        console.error("Login failed with message:", message);
        toast.error(message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred during login";
      toast.error(errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
