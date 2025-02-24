import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./updateproduct.module.css";

const categoryOptions = {
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

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "Shoes", // Default category
    productSizes: [],
    productColors: [],
    productImage: "",
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await axios.get(
          `http://localhost:9090/products/${id}`
        );
        setEditProduct({
          name: data.name || "",
          description: data.description || "",
          price: data.price || 0,
          stock: data.stock || 0,
          category: data.category || "Shoes",
          productSizes: data.productSizes || [],
          productColors: data.productColors || [],
          productImage: data.productImage || "",
        });
      } catch (error) {
        toast.error("Failed to fetch product details");
      }
    }
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setEditProduct({
      ...editProduct,
      category: selectedCategory,
      productSizes: categoryOptions[selectedCategory]?.sizes || [],
      productColors: categoryOptions[selectedCategory]?.colors || [],
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProduct({ ...editProduct, productImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:9090/products/${id}`, editProduct, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Product updated successfully");
      navigate("/productlist");
    } catch (error) {
      toast.error("Unable to update product");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Update Product</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Name</label>
        <input
          type="text"
          name="name"
          value={editProduct.name}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <label className={styles.label}>Description</label>
        <input
          type="text"
          name="description"
          value={editProduct.description}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <label className={styles.label}>Price</label>
        <input
          type="number"
          name="price"
          value={editProduct.price}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <label className={styles.label}>Stock</label>
        <input
          type="number"
          name="stock"
          value={editProduct.stock}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <label className={styles.label}>Category</label>
        <select
          name="category"
          value={editProduct.category}
          onChange={handleCategoryChange}
          className={styles.selectInput}
        >
          {Object.keys(categoryOptions).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label className={styles.label}>Sizes</label>
        <input
          type="text"
          value={editProduct.productSizes.join(", ")}
          readOnly
          className={styles.input}
        />

        <label className={styles.label}>Colors</label>
        <input
          type="text"
          value={editProduct.productColors.join(", ")}
          readOnly
          className={styles.input}
        />

        <label className={styles.label}>Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.inputFile}
        />

        {editProduct.productImage && (
          <div className={styles.imagePreview}>
            <p>Current Image:</p>
            <img
              src={editProduct.productImage}
              alt="Product"
              className={styles.previewImage}
            />
          </div>
        )}

        <button type="submit" className={styles.button}>
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
