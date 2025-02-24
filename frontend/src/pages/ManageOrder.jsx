import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./manageorder.module.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ManageOrders = () => {
  // Convert the productOwnerId to a number
  const productOwnerId = Number(sessionStorage.getItem("productOwnerId"));
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (productOwnerId) {
      axios
        .get(`http://localhost:9090/orders/owner/${productOwnerId}`)
        .then((res) => {
          setOrders(res.data);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          toast.error("Error fetching orders");
        });
    } else {
      toast.error("Product owner not logged in");
    }
  }, [productOwnerId]);

  // Update order status to "SHIPPED"
  const markOrderAsShipped = (orderId) => {
    axios
      .put(`http://localhost:9090/orders/${orderId}`, { status: "SHIPPED" })
      .then((res) => {
        toast.success(`Order ${orderId} marked as SHIPPED`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "SHIPPED" } : order
          )
        );
      })
      .catch((err) => {
        console.error("Error updating order:", err);
        toast.error("Failed to update order");
      });
  };

  // Cancel order: remove order from database and update UI
  const cancelOrder = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      axios
        .delete(`http://localhost:9090/orders/${orderId}`)
        .then(() => {
          toast.success("Order cancelled successfully");
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order.id !== orderId)
          );
        })
        .catch((err) => {
          console.error("Error cancelling order:", err);
          toast.error("Failed to cancel order");
        });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Orders</h1>
      {orders.length === 0 ? (
        <p>No orders available.</p>
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
              <div className={styles.buttonGroup}>
                <button
                  className={styles.cancelButton}
                  onClick={() => cancelOrder(order.id)}
                >
                  Cancel Order
                </button>
                <button
                  className={styles.shippedButton}
                  onClick={() => markOrderAsShipped(order.id)}
                >
                  Mark as Shipped
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
