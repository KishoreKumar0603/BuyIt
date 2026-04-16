import React, { useEffect, useState } from "react";
import axiosInstance from "../../context/axiosInstance";

export const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 loading state

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axiosInstance.get("/api/wishlist/my-wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWishlist(res.data);
        localStorage.setItem("wishlist", JSON.stringify(res.data));
      } catch (error) {
        console.error("❌ Error fetching wishlist:", error.message);

        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
      } finally {
        setLoading(false); // 👈 stop loading
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      const res = await axiosInstance.post(
        "/api/wishlist/remove",
        { productId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.status === 200) {
        setWishlist((prev) => {
          const updatedWishlist = prev.filter((item) => item._id !== productId);
          localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
          return updatedWishlist;
        });
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (err) {
      console.error("❌ Error removing from wishlist:", err.message);
    }
  };

  const moveToCart = async (productId, category) => {
    try {
      const token = localStorage.getItem("token");
      const resAddToCart = await axiosInstance.post(
        "/api/cart/add",
        { productId, category, quantity: 1 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (resAddToCart.status === 200) {
        await removeFromWishlist(productId);
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (err) {
      console.error("❌ Error moving to cart:", err.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center vh-100">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container min-vh-100">
      {wishlist.length === 0 ? (
        <h5 className="h-100 w-100 d-flex justify-content-center align-items-center">
          No items in wishlist 😢
        </h5>
      ) : (
        <div className="row h-100 wishlist-scroll-container">
          {wishlist.map((item) => (
            <div key={item._id} className="col-md-4 col-sm-6 col-12 mb-4">
              <div className="card wishlist-card position-relative d-flex justify-content-center p-4 box">
                <button
                  className="btn-close position-absolute top-0 end-0 m-2"
                  onClick={() => removeFromWishlist(item._id)}
                ></button>

                <img
                  src={item.image_url || "https://via.placeholder.com/150"}
                  className="card-img-center img-fluid"
                  alt={item.title}
                />

                <div className="card-body text-center">
                  <h6 className="card-title mb-1">
                    {item.title?.length > 25
                      ? item.title.slice(0, 25) + "..."
                      : item.title}
                  </h6>
                  <p className="text-muted small">Specs</p>
                  <p className="mb-1">
                    <span className="text-decoration-line-through text-muted me-1">
                      ₹{item.originalPrice || item.price + 100}
                    </span>
                    <strong>₹{item.price}</strong>
                  </p>
                  <p className="text-success fw-bold">
                    {item.discount || "10% OFF"}
                  </p>
                  <button
                    className="btn btn-dark"
                    onClick={() => moveToCart(item._id, item.category)}
                  >
                    Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
