import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "./admindashboard.module.css";

const AdminDashboard = () => {
  const [productOwners, setProductOwners] = useState([]);
  const [products, setProducts] = useState({});
  const [expandedOwners, setExpandedOwners] = useState({});
  const navigate = useNavigate();

  // Fetch all product owners
  const fetchProductOwners = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:9090/product-owners/all"
      );
      console.log("Fetched Product Owners:", data);
      if (Array.isArray(data)) {
        setProductOwners(data);
      } else if (data.owners) {
        setProductOwners(data.owners);
      } else {
        console.error("Unexpected API response:", data);
        toast.error("Unexpected API response format.");
      }
    } catch (error) {
      console.error("Error fetching product owners:", error);
      toast.error("Error fetching product owners");
    }
  };

  useEffect(() => {
    fetchProductOwners();
  }, []);

  // Fetch products for a specific owner
  const fetchProductsByOwner = async (ownerId) => {
    if (products[ownerId]) {
      // Toggle collapse if products already loaded
      setExpandedOwners((prev) => ({ ...prev, [ownerId]: !prev[ownerId] }));
      return;
    }
    try {
      const { data } = await axios.get(
        `http://localhost:9090/products/owner/${ownerId}`
      );
      console.log(`Products for owner ${ownerId}:`, data);
      setProducts((prev) => ({ ...prev, [ownerId]: data }));
      setExpandedOwners((prev) => ({ ...prev, [ownerId]: true }));
    } catch (error) {
      console.error(`Error fetching products for owner ${ownerId}:`, error);
      toast.error(`Error loading products for owner ${ownerId}`);
    }
  };

  // Approve a product
  const approveProduct = async (productId) => {
    try {
      await axios.put(`http://localhost:9090/products/${productId}/approve`);
      toast.success("Product approved successfully!");
      setProducts((prev) => {
        const updatedProducts = { ...prev };
        Object.keys(updatedProducts).forEach((ownerId) => {
          updatedProducts[ownerId] = updatedProducts[ownerId].map((prod) =>
            prod.id === productId ? { ...prod, approved: true } : prod
          );
        });
        return updatedProducts;
      });
    } catch (error) {
      console.error("Error approving product:", error);
      toast.error("Failed to approve product.");
    }
  };

  // Delete (reject) a product
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:9090/products/${productId}`);
      toast.success("Product deleted successfully!");
      setProducts((prev) => {
        const updatedProducts = { ...prev };
        Object.keys(updatedProducts).forEach((ownerId) => {
          updatedProducts[ownerId] = updatedProducts[ownerId].filter(
            (prod) => prod.id !== productId
          );
        });
        return updatedProducts;
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };

  // Navigate to Edit Owner Page
  const handleEditOwner = (ownerId) => {
    console.log("Navigating to EditOwner with ID:", ownerId);
    navigate(`/editowner/${ownerId}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      {productOwners.length === 0 ? (
        <p>No product owners found.</p>
      ) : (
        productOwners.map((owner) => {
          console.log("Owner Data:", owner);
          return (
            <section key={owner.productOwnerId} className={styles.ownerCard}>
              <div className={styles.ownerInfo}>
                <h3>Name: {owner?.productOwnerName ?? "N/A"}</h3>
                <h3>Email: {owner?.productOwnerEmail ?? "N/A"}</h3>
                <h3>Phone: {owner?.productOwnerNumber ?? "N/A"}</h3>
                <button
                  className={styles.loadProductsButton}
                  onClick={() => fetchProductsByOwner(owner.productOwnerId)}
                >
                  {expandedOwners[owner.productOwnerId]
                    ? "Collapse Products"
                    : "Load Products"}
                </button>
                <button
                  className={styles.editOwnerButton}
                  onClick={() => handleEditOwner(owner.productOwnerId)}
                >
                  Edit Owner
                </button>
              </div>
              {expandedOwners[owner.productOwnerId] && (
                <div className={styles.productList}>
                  <h4>Products Uploaded:</h4>
                  {products[owner.productOwnerId] ? (
                    products[owner.productOwnerId].length > 0 ? (
                      <ul className={styles.productUl}>
                        {products[owner.productOwnerId].map((product) => (
                          <li key={product.id} className={styles.productItem}>
                            <span>
                              {product.name} - ₹{product.price}
                            </span>
                            <div className={styles.productActions}>
                              <button
                                className={styles.approveButton}
                                onClick={() => approveProduct(product.id)}
                                disabled={product.approved}
                              >
                                {product.approved ? "Approved" : "Approve"}
                              </button>
                              <button
                                className={styles.rejectButton}
                                onClick={() => deleteProduct(product.id)}
                              >
                                Reject
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No products uploaded.</p>
                    )
                  ) : (
                    <p>Loading products...</p>
                  )}
                </div>
              )}
            </section>
          );
        })
      )}
    </div>
  );
};

export default AdminDashboard;
