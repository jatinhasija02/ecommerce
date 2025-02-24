import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PaymentPage.module.css";

const PaymentPage = () => {
  // Extract the order id from the URL (assumes route is /payment/:id)
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Payment option state: "COD" or "QR"
  const [paymentOption, setPaymentOption] = useState("COD");

  // Payment form state (if needed for card details, not used here)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Fetch order details so user can see order and user info before paying
  useEffect(() => {
    if (!id) {
      toast.error("Order id is missing");
      setLoading(false);
      return;
    }
    axios
      .get(`http://localhost:9090/orders/${id}`)
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order details:", err);
        toast.error("Error fetching order details");
        setLoading(false);
      });
  }, [id]);

  const handlePaymentOptionChange = (e) => {
    setPaymentOption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!order) {
      toast.error("Order details not loaded");
      return;
    }
    setProcessing(true);
    try {
      let updatedOrder;
      if (paymentOption === "QR") {
        // For QR Payment, update order status to "Pending Confirmation"
        updatedOrder = {
          ...order,
          status: "Pending Confirmation",
          paymentMethod: paymentOption,
        };
        await axios.put(`http://localhost:9090/orders/${id}`, updatedOrder, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Product owner will confirm your order soon");
      } else {
        // For Cash on Delivery, mark the order as Paid
        updatedOrder = {
          ...order,
          status: "Paid",
          paymentMethod: paymentOption,
        };
        await axios.put(`http://localhost:9090/orders/${id}`, updatedOrder, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Payment successful! Your order is now paid.");
      }
      navigate("/userProfile");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed, please try again");
    } finally {
      setProcessing(false);
    }
  };

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading order details...</div>;
  }

  if (!order) {
    return <div className={styles.error}>Order not found</div>;
  }

  return (
    <div className={styles.paymentContainer}>
      <h1 className={styles.title}>Payment</h1>
      {/* User Details Section */}
      {order.user && (
        <div className={styles.orderInfo}>
          <h2>User Details</h2>
          <p>
            <strong>Name:</strong> {order.user.name}
          </p>
          <p>
            <strong>Email:</strong> {order.user.email}
          </p>
          <p>
            <strong>Phone:</strong> {order.user.phone}
          </p>
          <p>
            <strong>Address:</strong> {order.user.address}
          </p>
        </div>
      )}
      {/* Order Details Section */}
      <div className={styles.orderInfo}>
        <h2>Order #{order.id}</h2>
        <p>
          <strong>Product:</strong> {order.product.name}
        </p>
        <p>
          <strong>Amount:</strong> ₹{order.product.price}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
      </div>
      <div className={styles.paymentOptions}>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="paymentOption"
            value="COD"
            checked={paymentOption === "COD"}
            onChange={handlePaymentOptionChange}
          />
          Cash on Delivery
        </label>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="paymentOption"
            value="QR"
            checked={paymentOption === "QR"}
            onChange={handlePaymentOptionChange}
          />
          QR Payment
        </label>
      </div>
      {paymentOption === "QR" && (
        <div className={styles.qrContainer}>
          <p>Scan the QR code below to pay:</p>
          <img
            src="/payment_QR.jpeg"
            alt="payment QR code"
            title="payment"
            className={styles.qrImage}
          />
        </div>
      )}
      <form className={styles.paymentForm} onSubmit={handleSubmit}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={processing}
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
