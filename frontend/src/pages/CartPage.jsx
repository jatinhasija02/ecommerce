import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "./cart.module.css";

const CartPage = () => {
  const navigate = useNavigate();
  const userID = sessionStorage.getItem("userID");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items for the logged-in user
  useEffect(() => {
    if (!userID) {
      toast.error("User not logged in");
      setLoading(false);
      return;
    }
    axios
      .get(`http://localhost:9090/cart/user/${userID}`)
      .then((res) => {
        setCartItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cart items:", err);
        toast.error("Error fetching cart items");
        setLoading(false);
      });
  }, [userID]);

  // Remove a cart item
  const handleRemoveItem = async (orderId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this item from your cart?"
      )
    ) {
      try {
        await axios.delete(`http://localhost:9090/cart/${orderId}`);
        toast.success("Item removed from cart");
        setCartItems(cartItems.filter((item) => item.id !== orderId));
      } catch (error) {
        console.error("Error removing item:", error);
        toast.error("Failed to remove item");
      }
    }
  };

  // Navigate to payment page for a specific cart item
  const handleBuyNow = (orderId) => {
    navigate(`/payment/${orderId}`);
  };

  // Navigation Header
  const handleNav = (path) => {
    navigate(path);
  };

  if (loading) {
    return <div className={styles.loading}>Loading cart items...</div>;
  }

  return (
    <div className={styles.orderContainer}>
      <header className={styles.navHeader}>
        <button
          className={styles.navButton}
          onClick={() => handleNav("/userProfile")}
        >
          Profile
        </button>

        <button
          className={styles.navButton}
          onClick={() => handleNav(`/orderpage/${userID}`)}
        >
          Orders
        </button>
      </header>
      <h1 className={styles.orderTitle}>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className={styles.orderGrid}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.orderCard}>
              <h3>Item #{item.id}</h3>
              <p>
                <strong>Product:</strong> {item.product.name}
              </p>
              <p>
                <strong>Price:</strong> ₹{item.product.price}
              </p>
              <div className={styles.orderButtons}>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
                <button
                  className={styles.buyNowButton}
                  onClick={() => handleBuyNow(item.id)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
