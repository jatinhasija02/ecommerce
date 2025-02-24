import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./addproduct.module.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [productOwnerId, setProductOwnerId] = useState(null);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "Shoes", // default category
    size: "",
    color: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = sessionStorage.getItem("productOwnerId");
    if (storedId) {
      setProductOwnerId(storedId);
    }
  }, []);

  // Debug: Log updated state on every change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => {
      const newState = { ...prev, [name]: value };
      console.log("Updated product state:", newState);
      return newState;
    });
  };

  const handleCategoryChange = (e) => {
    setProduct((prev) => {
      const newState = {
        ...prev,
        category: e.target.value,
        size: "",
        color: "",
      };
      console.log("Category changed, resetting size and color:", newState);
      return newState;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected image files:", files);
    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productOwnerId) {
      toast.error("Product owner not found.");
      return;
    }

    console.log("Submitting product:", product);

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("category", product.category);
    formData.append("productOwnerId", productOwnerId);
    // Append size and color as plain strings
    formData.append("productSizes", product.size);
    formData.append("productColors", product.color);

    // Determine available status based on stock value
    // If stock is 0 (or falsy) then available is false (0)
    const available = Number(product.stock) > 0 ? true : false;
    formData.append("available", available);

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await axios.post("http://localhost:9090/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product added successfully!");
      navigate("/productlist");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product.");
    }
  };

  // Options for category, sizes, and colors
  const options = {
    Shoes: {
      sizes: ["8", "9", "10", "11"],
      colors: ["black", "white", "blue"],
    },
    "T-shirt": {
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        "white",
        "black",
        "blue",
        "orange",
        "green",
        "pink",
        "brown",
        "purple",
        "beige",
      ],
    },
    Jeans: {
      sizes: ["34", "36", "38", "40", "42", "44", "46"],
      colors: ["blue", "black", "white", "beige"],
    },
    Boots: {
      sizes: ["8", "9", "10", "11"],
      colors: ["brown", "black", "darkbrown"],
    },
    Shirts: {
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        "white",
        "black",
        "blue",
        "orange",
        "green",
        "pink",
        "brown",
        "purple",
        "beige",
      ],
    },
  };

  const currentOptions = options[product.category];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add Product</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={product.category}
          onChange={handleCategoryChange}
          className={styles.selectInput}
          required
        >
          <option value="Shoes">Shoes</option>
          <option value="T-shirt">T-shirt</option>
          <option value="Jeans">Jeans</option>
          <option value="Boots">Boots</option>
          <option value="Shirts">Shirts</option>
        </select>
        {currentOptions && (
          <select
            name="size"
            value={product.size}
            onChange={handleChange}
            className={styles.selectInput}
            required
          >
            <option value="">Select Size</option>
            {currentOptions.sizes.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
          </select>
        )}
        {currentOptions && (
          <select
            name="color"
            value={product.color}
            onChange={handleChange}
            className={styles.selectInput}
            required
          >
            <option value="">Select Color</option>
            {currentOptions.colors.map((color, index) => (
              <option key={index} value={color}>
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </option>
            ))}
          </select>
        )}
        <h3>Upload Images</h3>
        <input type="file" multiple onChange={handleImageChange} />
        <button type="submit" className={styles.submitButton}>
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
