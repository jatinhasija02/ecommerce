import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./orderHistory.module.css";
import toast from "react-hot-toast";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  // Assume userID is stored in sessionStorage after login
  const userID = sessionStorage.getItem("userID");

  useEffect(() => {
    if (userID) {
      axios
        .get(`http://localhost:9090/orders/user/${userID}`)
        .then((res) => {
          setOrders(res.data);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          toast.error("Error fetching order history");
        });
    }
  }, [userID]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Orders</h1>
      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
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
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(order.orderDate).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
