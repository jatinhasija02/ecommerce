import React, { useState, useEffect } from "react";
import styles from "./signup.module.css"; // Reusing the signup styles
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EditOwner = () => {
  const { id } = useParams(); // ✅ Fixed: Changed 'ownerID' to 'id'
  const navigate = useNavigate();
  const [ownerDetails, setOwnerDetails] = useState({
    productOwnerName: "",
    productOwnerEmail: "",
    productOwnerNumber: "",
    productOwnerAddress: "",
  });

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:9090/product-owners/${id}`)
        .then((res) => {
          console.log("Fetched Data:", res.data);
          if (res.data) {
            setOwnerDetails((prev) => ({
              ...prev, // Preserve existing state
              ...res.data, // Merge new data
            }));
          }
        })
        .catch((err) => {
          console.error("Error fetching owner details:", err);
          toast.error("Failed to fetch owner details.");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOwnerDetails({
      ...ownerDetails,
      [name]: value,
    });
  };

  const updateOwner = (e) => {
    e.preventDefault();
    console.log("Updating owner with ID:", id, ownerDetails); // ✅ Debugging log
    axios
      .put(`http://localhost:9090/product-owners/update/${id}`, ownerDetails) // ✅ Fixed API URL
      .then(() => {
        toast.success("Product owner updated successfully!");
        navigate("/admindashboard", { replace: true }); // ✅ Fixed redirect path
      })
      .catch((err) => {
        console.error("Error updating product owner:", err);
        toast.error("Something went wrong");
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Edit Product Owner {id}</h1>
        <form onSubmit={updateOwner}>
          <div className={styles.inputGroup}>
            <label htmlFor="productOwnerName">Name</label>
            <input
              type="text"
              id="productOwnerName"
              name="productOwnerName"
              placeholder="Enter name"
              value={ownerDetails.productOwnerName}
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
              value={ownerDetails.productOwnerEmail}
              onChange={handleChange}
              required
              disabled
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
              value={ownerDetails.productOwnerNumber}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditOwner;
