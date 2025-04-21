import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext"; // ✅ import useAuth
import "../../assets/css/components/ProductListing.css";

export const ProductListing = () => {
  const { category } = useParams();
  const { user } = useAuth(); // ✅ get user from AuthContext

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [minPrice] = useState(0);

  const priceBreakpoints = [
    500, 1000, 2500, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 35000,
    40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000,
    95000, 100000,
  ];

  const [maxPrice, setMaxPrice] = useState(
    priceBreakpoints[priceBreakpoints.length - 1]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  useEffect(() => {
    if (category) {
      axios
        .get(`http://localhost:5000/api/products?category=${category}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setProducts(res.data);
            console.log(res.data);
          } else {
            console.error("Invalid product response format");
            setProducts([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
          setProducts([]);
        });
    }
  }, [category]);

  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:5000/api/wishlist/my-wishlist", {
          headers: {
            Authorization: `Bearer ${user.token}`, // ✅ authorized wishlist fetch
          },
        })
        .then((res) => {
          if (Array.isArray(res.data)) {
            // Set wishlist to an array of product IDs
            setWishlist(res.data.map((item) => item.productId));
          }
        })
        .catch((err) => console.error("Failed to fetch wishlist", err));
    }
  }, [user]);

  const findNearestBreakpoint = (value) => {
    return priceBreakpoints.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  };

  const handlePriceChange = (e) => {
    const selectedPrice = Number(e.target.value);
    const nearestPrice = findNearestBreakpoint(selectedPrice);
    setMaxPrice(nearestPrice);
  };

  const filteredProducts = products.filter((product) => {
    const price = parseFloat(product.price);
    return !isNaN(price) && price >= minPrice && price <= maxPrice;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        // Remove from wishlist
        await axios.delete(
          `http://localhost:5000/api/wishlist/remove/${productId}`,
          config
        );
        setWishlist((prev) => prev.filter((id) => id !== productId)); // Remove the product from the wishlist state
        toast.success("Removed from wishlist");
      } else {
        // Add to wishlist
        await axios.post(
          "http://localhost:5000/api/wishlist/add/",
          { productId, category, userId: user.id }, // Include category here
          config
        );
        setWishlist((prev) => [...prev, productId]); // Add the product to the wishlist state
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="d-flex p-3">
        <div
          className="p-3 me-3 box"
          style={{ width: "250px", height: "200px" }}
        >
          <h5 className="mb-3">Filters</h5>
          <div>
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
          </div>
        </div>

        <div className="flex-grow-1">
          {currentProducts.length > 0 ? (
            currentProducts.map((product, index) => (
              <div
                key={index}
                className="product-card bg-white p-4 border d-flex align-items-start position-relative mb-3"
              >
                <div className="row g-0 w-100">
                  <div
                    className="col-2 d-flex justify-content-center align-items-center"
                    style={{ minWidth: "120px" }}
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="img-fluid"
                      style={{
                        width: "120px",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      loading="lazy"
                    />
                  </div>
                  <div className="col-10">
                    <div className="d-flex justify-content-between">
                      <h5>{product.title}</h5>
                      <button
                        className="btn btn-sm"
                        onClick={() =>
                          toggleWishlist(
                            product._id,
                            product.category.main.toLowerCase()
                          )
                        }
                        style={{ fontSize: "20px", color: "black" }}
                      >
                        {/* Check if product is in wishlist and display filled or empty heart accordingly */}
                        {wishlist.includes(product._id) ? "♥" : "♡"}
                      </button>
                    </div>
                    <small className="text-muted d-block mb-1">
                      Brand: {product.brand}
                    </small>
                    <span className="text-success d-block fw-medium">
                      ⭐ {product.rating} / 5
                    </span>
                    <span className="text-success d-block">Special Offer</span>
                    <p className="mt-2">₹{product.price}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No products found for "{category}"</p>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className="page-item">
              <button
                className="page-link text-dark"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className="page-item">
                <button
                  className="page-link text-dark"
                  onClick={() => paginate(index + 1)}
                  aria-current={currentPage === index + 1 ? "page" : undefined}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className="page-item">
              <button
                className="page-link text-dark"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
