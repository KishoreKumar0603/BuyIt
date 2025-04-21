import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/components/ProductListing.css";
import { PiHeartDuotone, PiHeartStraightFill  } from "react-icons/pi";

export const ProductListing = () => {
  const { category } = useParams();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [minPrice] = useState(0);
  const [sortOrder, setSortOrder] = useState(""); // asc or desc

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
          } else {
            setProducts([]);
            console.error("Invalid product format");
          }
        })
        .catch((err) => {
          setProducts([]);
          console.error("Error fetching products:", err);
        });
    }
  }, [category]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");

    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    } else if (user) {
      axios
        .get("http://localhost:5000/api/wishlist/my-wishlist", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (Array.isArray(res.data)) {
            const wishlistData = res.data.map((item) => item.productId);
            setWishlist(wishlistData);
            localStorage.setItem("wishlist", JSON.stringify(wishlistData));
          }
        })
        .catch((err) => console.error("Wishlist fetch error:", err));
    }
  }, [user]);

  const handlePriceChange = (e) => {
    const selectedPrice = Number(e.target.value);
    const nearest = priceBreakpoints.reduce((prev, curr) =>
      Math.abs(curr - selectedPrice) < Math.abs(prev - selectedPrice)
        ? curr
        : prev
    );
    setMaxPrice(nearest);
  };

  const filteredProducts = products
    .filter((product) => {
      const price = parseFloat(product.price);
      return !isNaN(price) && price >= minPrice && price <= maxPrice;
    })
    .sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      if (sortOrder === "asc") return priceA - priceB;
      if (sortOrder === "desc") return priceB - priceA;
      return 0;
    });

  const clearFilter = () => {
    setMaxPrice(priceBreakpoints[priceBreakpoints.length - 1]);
    setSortOrder(""); // Reset sorting
    setCurrentPage(1); // Reset pagination to page 1
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

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
        await axios.delete(
          `http://localhost:5000/api/wishlist/remove/${productId}`,
          config
        );
        const updated = wishlist.filter((id) => id !== productId);
        setWishlist(updated);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        toast.success("Removed from wishlist");
      } else {
        await axios.post(
          "http://localhost:5000/api/wishlist/add/",
          { productId, category, userId: user.id },
          config
        );
        const updated = [...wishlist, productId];
        setWishlist(updated);
        localStorage.setItem("wishlist", JSON.stringify(updated));
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
          style={{ width: "250px", height: "400px" }}
        >
          <h5 className="mb-3">Filters</h5>

          <div className="mb-3">
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

          <hr />

          <div>
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
              <label
                className="form-check-label label-radio"
                htmlFor="lowToHigh"
              >
                Low to High
              </label>
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
              <label
                className="form-check-label label-radio"
                htmlFor="highToLow"
              >
                High to Low
              </label>
            </div>
          </div>
          <div>
            <a
              href="#"
              onClick={clearFilter}
              className="text-decoration-none text-primary mt-2"
              style={{ cursor: "pointer" }}
            >clear Filter</a>
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
                      <h5>{truncateText(product.title, 90)}</h5>
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
                        {wishlist.includes(product._id) ? <PiHeartStraightFill /> : <PiHeartDuotone />}
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

      {filteredProducts.length > 10 && (
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
                    aria-current={
                      currentPage === index + 1 ? "page" : undefined
                    }
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
      )}
    </>
  );
};
