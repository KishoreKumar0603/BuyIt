import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/components/ProductListing.css";
import { PiHeartDuotone, PiHeartStraightFill } from "react-icons/pi";
import { getProducts } from "../../api/productApi";
import axiosInstance from "../../context/axiosInstance";

export const ProductListing = () => {
  const { category } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    document.title = `BuyIt | ${category}`;
  }, [category]);

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState(""); // price or rating
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });

  const priceBreakpoints = [
    500, 1000, 2500, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 35000,
    40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000,
    95000, 100000,
  ];

  const fetchProducts = async (page = 1, search = searchQuery) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        limit: 10,
      };

      if (category) params.category = category;
      if (search) params.search = search;
      if (minPrice > 0) params.minPrice = minPrice;
      if (maxPrice < 100000) params.maxPrice = maxPrice;
      if (sortBy) {
        params.sortBy = sortBy;
        params.sortOrder = sortOrder;
      }

      const data = await getProducts(params);
      setProducts(Array.isArray(data.products) ? data.products : []);
      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: 10,
        },
      );
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const routeSearch =
      new URLSearchParams(location.search).get("search") || "";
    setSearchQuery(routeSearch);
    setMinPrice(0);
    setMaxPrice(100000);
    setSortBy("");
    setSortOrder("asc");
    fetchProducts(1, routeSearch);
  }, [category, location.search]);

  useEffect(() => {
    if (category) {
      const timer = setTimeout(() => {
        fetchProducts(1); // Reset to page 1 when filters change
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, minPrice, maxPrice, sortBy, sortOrder]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
        return;
      }

      if (!user) return;

      try {
        const res = await axiosInstance.get("/api/wishlist/my-wishlist", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const wishlistData = Array.isArray(res.data)
          ? res.data.map((item) => item._id || item.productId).filter(Boolean)
          : [];

        setWishlist(wishlistData);
        localStorage.setItem("wishlist", JSON.stringify(wishlistData));
      } catch (err) {
        console.error("Wishlist fetch error:", err);
      }
    };

    fetchWishlist();
  }, [user, category]);

  const handlePriceChange = (e) => {
    const selected = Number(e.target.value);
    const nearest = priceBreakpoints.reduce((prev, curr) =>
      Math.abs(curr - selected) < Math.abs(prev - selected) ? curr : prev,
    );
    setMaxPrice(nearest);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const clearFilter = () => {
    setSearchQuery("");
    setMaxPrice(100000);
    setMinPrice(0);
    setSortBy("");
    setSortOrder("asc");
    setCurrentPage(1);
    fetchProducts(1, "");
  };

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
        await axiosInstance.post("/api/wishlist/remove", { productId }, config);
        const updatedWishlist = wishlist.filter((id) => id !== productId);
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        toast.success("Removed from wishlist");
      } else {
        await axiosInstance.post(
          "/api/wishlist/add",
          { productId, category },
          config,
        );
        const updatedWishlist = [...wishlist, productId];
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      fetchProducts(pageNumber);
    }
  };

  return (
    <>
      {loading ? (
        <div
          className="d-flex justify-content-center"
          style={{ height: "300px" }}
        >
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="d-flex p-3">
          <div
            className="p-3 me-3 box"
            style={{ width: "250px", maxHeight: "600px", overflowY: "auto" }}
          >
            <h5 className="mb-3">Filters</h5>

            <div className="mb-3">
              <label className="form-label fw-bold">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <hr />

            <div className="mb-3">
              <label className="form-label fw-bold">Price Range</label>
              <input
                type="range"
                min={priceBreakpoints[0]}
                max={priceBreakpoints[priceBreakpoints.length - 1]}
                step={1}
                value={maxPrice}
                onChange={handlePriceChange}
                className="form-range"
              />
              <div className="d-flex justify-content-between mt-2">
                <small>Min: ₹{minPrice}</small>
                <small>Max: ₹{maxPrice}</small>
              </div>
            </div>

            <hr />

            <div className="mb-3">
              <label className="form-label fw-bold">Sort By</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sortBy"
                  id="sortPrice"
                  checked={sortBy === "price"}
                  onChange={() => handleSortChange("price")}
                />
                <label className="form-check-label" htmlFor="sortPrice">
                  Price{" "}
                  {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sortBy"
                  id="sortRating"
                  checked={sortBy === "rating"}
                  onChange={() => handleSortChange("rating")}
                />
                <label className="form-check-label" htmlFor="sortRating">
                  Rating{" "}
                  {sortBy === "rating" && (sortOrder === "asc" ? "↑" : "↓")}
                </label>
              </div>
            </div>

            <hr />

            <button
              className="btn btn-sm btn-outline-secondary w-100"
              onClick={clearFilter}
            >
              Clear Filters
            </button>
          </div>

          <div className="flex-grow-1">
            {products.length > 0 ? (
              <>
                <div className="mb-3">
                  <small className="text-muted">
                    Showing {products.length} of {pagination.totalProducts}{" "}
                    products
                  </small>
                </div>

                {products.map((product) => (
                  <Link
                    to={`/products/${category}/${product._id}`}
                    key={product._id}
                    className="text-decoration-none"
                  >
                    <div className="product-card bg-white p-4 border d-flex align-items-start position-relative mb-3">
                      <div className="row g-0 w-100">
                        <div
                          className="col-2 d-flex justify-content-center align-items-center"
                          style={{ minWidth: "120px" }}
                        >
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="img-fluid"
                            style={{
                              width: "120px",
                              height: "130px",
                              objectFit: "contain",
                            }}
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
                          <small className="text-muted d-block mb-1">
                            Brand: {product.brand}
                          </small>
                          <span className="text-success fw-medium d-block">
                            ⭐ {product.rating} / 5
                          </span>
                          <span className="text-success d-block">
                            Special Offer
                          </span>
                          <p className="mt-2">₹{product.price}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                <div className="d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination">
                      <li
                        className={`page-item ${!pagination.hasPrevPage ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link text-dark"
                          onClick={() => paginate(currentPage - 1)}
                          disabled={!pagination.hasPrevPage}
                        >
                          Previous
                        </button>
                      </li>

                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1,
                      )
                        .filter((page) => {
                          return (
                            page === 1 ||
                            page === pagination.totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          );
                        })
                        .map((page, index, array) => {
                          const prevPage = array[index - 1];
                          if (prevPage && page - prevPage > 1) {
                            return (
                              <React.Fragment key={`ellipsis-${page}`}>
                                <li className="page-item disabled">
                                  <span className="page-link">...</span>
                                </li>
                                <li
                                  key={page}
                                  className={`page-item ${
                                    currentPage === page ? "active" : ""
                                  }`}
                                >
                                  <button
                                    className="page-link text-dark"
                                    onClick={() => paginate(page)}
                                  >
                                    {page}
                                  </button>
                                </li>
                              </React.Fragment>
                            );
                          }
                          return (
                            <li
                              key={page}
                              className={`page-item ${
                                currentPage === page ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link text-dark"
                                onClick={() => paginate(page)}
                              >
                                {page}
                              </button>
                            </li>
                          );
                        })}

                      <li
                        className={`page-item ${!pagination.hasNextPage ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link text-dark"
                          onClick={() => paginate(currentPage + 1)}
                          disabled={!pagination.hasNextPage}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">
                  No products found for &quot;{searchQuery || category}&quot;
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
