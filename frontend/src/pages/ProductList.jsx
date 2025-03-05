import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./productlist.module.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const productOwnerId = Number(sessionStorage.getItem("productOwnerId"));
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9090/products")
      .then((res) => {
        console.log("API Response:", res.data); // ✅ Debugging
        const ownerProducts = res.data.filter(
          (prod) =>
            prod.productOwner &&
            (prod.productOwner.productOwnerId || prod.productOwner.id) ===
              productOwnerId
        );
        setProducts(ownerProducts);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        toast.error("Error fetching products");
      });
  }, [productOwnerId]);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:9090/products/${id}`)
      .then(() => {
        toast.success("Product deleted successfully");
        setProducts((prev) => prev.filter((prod) => prod.id !== id));
      })
      .catch((err) => {
        console.error("Delete error:", err);
        toast.error("Failed to delete product");
      });
  };

  const handleUpdate = (id) => {
    navigate(`/updateproduct/${id}`);
  };

  const handleManageOrders = () => {
    navigate("/manageorders");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Products</h2>
      <div style={{ marginBottom: "20px" }}>
        <button
          className={styles.addButton}
          onClick={() => navigate("/addproduct")}
        >
          Add Product
        </button>
        <button
          className={styles.manageOrdersButton}
          onClick={handleManageOrders}
          style={{ marginLeft: "10px" }}
        >
          Manage Orders
        </button>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td>
                  {prod.productImageBase64 ? (
                    <img
                      src={`data:image/jpeg;base64,${prod.productImageBase64}`}
                      alt={prod.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{prod.name}</td>
                <td>{prod.price}</td>
                <td>{prod.stock}</td>
                <td>{prod.category}</td>
                <td
                  style={{
                    color: prod.approved ? "green" : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {prod.approved ? "APPROVED" : "PENDING"}
                </td>
                <td>
                  <button
                    className={styles.btnUpdate}
                    onClick={() => handleUpdate(prod.id)}
                  >
                    Update
                  </button>
                  <button
                    className={styles.btnDelete}
                    onClick={() => handleDelete(prod.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;
