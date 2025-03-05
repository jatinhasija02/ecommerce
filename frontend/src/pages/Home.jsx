import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const userID = sessionStorage.getItem("userID");

  // Fetch only approved products from the backend
  useEffect(() => {
    axios
      .get("http://localhost:9090/products/approved")
      .then((res) => {
        console.log("Fetched Products:", res.data);
        setProducts(res.data);
      })
      .catch((err) => console.error("Error fetching approved products:", err));
  }, []);

  // Extract unique categories (case-insensitive)
  const uniqueCategories = [
    ...new Set(products.map((p) => p.category?.toLowerCase())),
  ];

  // Featured carousel settings: 3 products, autoplay, no dots
  const featuredSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  // Category carousel settings: 7 products, no autoplay, with arrows
  const categorySettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  // Function to render product cards
  const renderProductCard = (product, isFeatured = false) => (
    <div
      key={product.id}
      className={isFeatured ? styles.featuredCard : styles.productCard}
      onClick={() =>
        userID ? navigate(`/products/${product.id}`) : navigate("/login")
      }
    >
      {product.productImageBase64 ? (
        <img
          src={`data:image/jpeg;base64,${product.productImageBase64}`}
          alt={product.name}
          className={isFeatured ? styles.featuredImage : styles.productImage}
          onError={(e) => (e.target.src = "/placeholder.jpg")}
        />
      ) : (
        <img
          src="/placeholder.jpg"
          alt="Placeholder"
          className={styles.productImage}
        />
      )}
      {!isFeatured && (
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productPrice}>₹{product.price}</p>
        </div>
      )}
    </div>
  );

  return (
    <section className={styles.homeContainer}>
      {/* Featured Products Carousel */}
      {products.length > 0 && (
        <>
          <header className={styles.featuredHeader}>
            <h2>Featured Products</h2>
          </header>
          <div className={styles.featuredCarousel}>
            <Slider {...featuredSettings}>
              {products.map((product) => renderProductCard(product, true))}
            </Slider>
          </div>
        </>
      )}

      {/* Category-wise Carousels */}
      {uniqueCategories.map((cat) => {
        const categoryProducts = products.filter(
          (p) => p.category?.toLowerCase() === cat
        );
        if (categoryProducts.length === 0) return null;
        return (
          <section key={cat} className={styles.categorySection}>
            <h2>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h2>
            <Slider {...categorySettings}>
              {categoryProducts.map((product) => renderProductCard(product))}
            </Slider>
          </section>
        );
      })}
    </section>
  );
};

export default Home;
