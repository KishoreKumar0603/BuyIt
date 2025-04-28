import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/components/ProductListing.css";
import { PiHeartDuotone, PiHeartStraightFill } from "react-icons/pi";

import axiosInstance from "../../context/axiosInstance";
export const ProductListing = () => {
  const { category } = useParams();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [minPrice] = useState(0);
  const [sortOrder, setSortOrder] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const priceBreakpoints = [
    500, 1000, 2500, 5000, 7500, 10000, 15000, 20000, 25000, 30000,
    35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000,
    80000, 85000, 90000, 95000, 100000,
  ];
  useEffect(() => {
    if (category) {
      axiosInstance
        .get(`/api/products?category=${category}`)
        .then((res) => {
          setProducts(Array.isArray(res.data) ? res.data : []);
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
          setProducts([]);
        });
    }
  }, [category]);
  useEffect(() => {
    const fetchWishlist = () => {
      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      } else if (user) {
        axiosInstance
          .get("/api/wishlist/my-wishlist", {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          .then((res) => {
            const wishlistData = res.data.map((item) => item.productId);
            setWishlist(wishlistData);
            localStorage.setItem("wishlist", JSON.stringify(wishlistData));
          })
          .catch((err) => console.error("Wishlist fetch error:", err));
      }
    };
    
    fetchWishlist();
  }, [user, category]);

  const handlePriceChange = (e) => {
    const selected = Number(e.target.value);
    const nearest = priceBreakpoints.reduce((prev, curr) =>
      Math.abs(curr - selected) < Math.abs(prev - selected) ? curr : prev
    );
    setMaxPrice(nearest);
  };

  const clearFilter = () => {
    setMaxPrice(100000);
    setSortOrder("");
    setCurrentPage(1);
  };

  const filteredProducts = products
    .filter(({ price }) => {
      const parsedPrice = parseFloat(price);
      return !isNaN(parsedPrice) && parsedPrice >= minPrice && parsedPrice <= maxPrice;
    })
    .sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return sortOrder === "asc" ? priceA - priceB : sortOrder === "desc" ? priceB - priceA : 0;
    });

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const toggleWishlist = async (productId, category) => {
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const isInWishlist = wishlist.includes(productId);

    try {
      if (isInWishlist) {
        await axiosInstance.delete(
          `/api/wishlist/remove/${productId}`,
          config
        );
        const updatedWishlist = wishlist.filter((id) => id !== productId);

        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        toast.success("Removed from wishlist");
      } else {
        await axiosInstance.post(
          `/api/wishlist/add/`,
          { productId, category, userId: user.id },
          config
        );
        const updatedWishlist = [...wishlist, productId];

        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="d-flex p-3">
      <div className="p-3 me-3 box" style={{ width: "250px", height: "400px" }}>
        <h5 className="mb-3">Filters</h5>
        <label className="form-label">Price</label>
        <input
          type="range"
          min={priceBreakpoints[0]}
          max={priceBreakpoints[priceBreakpoints.length - 1]}
          step={1}
          value={maxPrice}
          onChange={handlePriceChange}
          className="form-range"
        />
        <div className="d-flex justify-content-between">
          <small>Min: ₹{minPrice}</small>
          <small>Max: ₹{maxPrice}</small>
        </div>

        <hr />

        <label className="form-label">Sort by Price</label>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sortOrder"
            id="lowToHigh"
            value="asc"
            checked={sortOrder === "asc"}
            onChange={(e) => setSortOrder(e.target.value)}
          />
          <label className="form-check-label" htmlFor="lowToHigh">Low to High</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sortOrder"
            id="highToLow"
            value="desc"
            checked={sortOrder === "desc"}
            onChange={(e) => setSortOrder(e.target.value)}
          />
          <label className="form-check-label" htmlFor="highToLow">High to Low</label>
        </div>

        <a href="#" onClick={clearFilter} className="text-decoration-none text-primary mt-2" style={{ cursor: "pointer" }}>
          Clear Filter
        </a>
      </div>

      <div className="flex-grow-1">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <Link to={`/products/${category}/${product._id}`} key={product._id} className="text-decoration-none">
              <div className="product-card bg-white p-4 border d-flex align-items-start position-relative mb-3">
                <div className="row g-0 w-100">
                  <div className="col-2 d-flex justify-content-center align-items-center" style={{ minWidth: "120px" }}>
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="img-fluid"
                      style={{ width: "120px", height: "100%", objectFit: "contain" }}
                      loading="lazy"
                    />
                  </div>
                  <div className="col-10">
                    <div className="d-flex justify-content-between">
                      <h5>{truncateText(product.title, 90)}</h5>
                      <button
                        className="btn btn-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product._id, category);
                        }}
                        style={{ fontSize: "20px", color: "black" }}
                      >
                        {wishlist.includes(product._id) ? (
                          <PiHeartStraightFill />
                        ) : (
                          <PiHeartDuotone />
                        )}
                      </button>
                    </div>
                    <small className="text-muted d-block mb-1">Brand: {product.brand}</small>
                    <span className="text-success fw-medium d-block">⭐ {product.rating} / 5</span>
                    <span className="text-success d-block">Special Offer</span>
                    <p className="mt-2">₹{product.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-muted">No products found for "{category}"</p>
        )}
      </div>
    </div>
  );
};
