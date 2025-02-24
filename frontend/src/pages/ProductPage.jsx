import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./productpage.module.css";

const ProductPage = () => {
  // Retrieve the product id from the URL (make sure your route is defined as /products/:id)
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const userID = sessionStorage.getItem("userID"); // Logged-in user's ID

  useEffect(() => {
    if (!id) {
      console.error("Product id is undefined");
      setLoading(false);
      return;
    }
    axios
      .get(`http://localhost:9090/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!product) {
    return <div className={styles.error}>Product not found</div>;
  }

  // Place an order with status "Ordered" for Buy Now
  const handleBuy = async () => {
    const confirmBuy = window.confirm("Do you want to buy this product?");
    if (!confirmBuy) return;
    if (!userID) {
      toast.error("Please log in to place an order.");
      return;
    }
    try {
      const orderPayload = {
        product: { id: product.id },
        user: { id: parseInt(userID) },
        quantity: 1,
        status: "Ordered", // or "Pending Payment"
      };
      const response = await axios.post(
        "http://localhost:9090/orders",
        orderPayload,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Order placed successfully");
      // Navigate to the payment page with the order id returned from the backend
      navigate(`/payment/${response.data.id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    }
  };

  // Place an order with status "In Cart" for Add to Cart
  const handleAddToCart = async () => {
    if (!userID) {
      toast.error("Please log in to add products to your cart.");
      return;
    }
    try {
      const orderPayload = {
        product: { id: product.id },
        user: { id: parseInt(userID) },
        quantity: 1,
        status: "In Cart",
      };
      await axios.post("http://localhost:9090/orders", orderPayload, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Product added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <div className={styles.productPage}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        Back
      </button>
      <div className={styles.productContainer}>
        <div className={styles.imageSection}>
          {product.productImageBase64 ? (
            <img
              src={`data:image/jpeg;base64,${product.productImageBase64}`}
              alt={product.name}
              className={styles.productImage}
            />
          ) : (
            <div className={styles.noImage}>No Image</div>
          )}
        </div>
        <div className={styles.detailsSection}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.productDescription}>{product.description}</p>
          <p className={styles.productPrice}>₹{product.price}</p>
          <p className={styles.productStock}>Stock: {product.stock}</p>
          <p className={styles.productCategory}>Category: {product.category}</p>
          {product.productSizes && product.productSizes.length > 0 && (
            <div className={styles.sizes}>
              <strong>Sizes:</strong> {product.productSizes.join(", ")}
            </div>
          )}
          {product.productColors && product.productColors.length > 0 && (
            <div className={styles.colors}>
              <strong>Colors:</strong> {product.productColors.join(", ")}
            </div>
          )}
          <div className={styles.actionButtons}>
            <button onClick={handleBuy} className={styles.buyButton}>
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className={styles.addToCartButton}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
