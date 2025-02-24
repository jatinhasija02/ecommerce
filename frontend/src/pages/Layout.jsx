import React from "react";
import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "../components/fotter/Footer";
import styles from "./layout.module.css"; // Import your layout CSS

const Layout = () => {
  return (
    <div className={styles.layoutContainer}>
      <header className={styles.header}>
        <Navbar />
        <Toaster />
      </header>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <footer className={styles.footerContainer}>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
