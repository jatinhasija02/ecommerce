import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./orderPage.module.css";

const OrdersPage = () => {
  const { id: userIdParam } = useParams(); // Expect route: /orderpage/:id
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (userIdParam) {
      axios
        .get(`http://localhost:9090/orders/user/${userIdParam}`)
        .then((res) => {
          setOrders(res.data);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          toast.error("Error fetching your orders");
        });
    } else {
      toast.error("User ID not provided in URL");
    }
  }, [userIdParam]);

  const handleRemoveFromOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.delete(`http://localhost:9090/orders/${orderId}`);
        toast.success("Order cancelled successfully");
        setOrders(orders.filter((order) => order.id !== orderId));
      } catch (error) {
        console.error("Error cancelling order:", error);
        toast.error("Failed to cancel order");
      }
    }
  };

  // Navigation Header
  const handleNav = (path) => {
    navigate(path);
  };

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
          onClick={() => handleNav(`/cartpage/${userIdParam}`)}
        >
          Cart
        </button>
      </header>
      <h1 className={styles.orderTitle}>Your Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders in your cart.</p>
      ) : (
        <div className={styles.orderGrid}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <h3>Order #{order.id}</h3>
              <p>
                <strong>Product:</strong> {order.product.name}
              </p>
              <p>
                <strong>Price:</strong> ₹{order.product.price}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <div className={styles.orderButtons}>
                <button
                  className={styles.cancelButton}
                  onClick={() => handleRemoveFromOrder(order.id)}
                >
                  Cancel Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
