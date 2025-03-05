import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaGoogle,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import styles from "./footer.module.css"; // Import CSS module

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <section className={styles.socialIcons}>
          <a href="#!" className={styles.icon}>
            <FaFacebookF />
          </a>
          <a href="#!" className={styles.icon}>
            <FaTwitter />
          </a>
          <a href="#!" className={styles.icon}>
            <FaGoogle />
          </a>
          <a href="#!" className={styles.icon}>
            <FaInstagram />
          </a>
          <a href="#!" className={styles.icon}>
            <FaLinkedinIn />
          </a>
          <a href="#!" className={styles.icon}>
            <FaGithub />
          </a>
        </section>
      </div>

      <div className={styles.copyright}>
        © 2025 Copyright:
        <a href="https://github.com/jatinhasija02/" className={styles.link}>
          {" "}
          @JatinHasija
        </a>
      </div>
    </footer>
  );
};

export default Footer;
