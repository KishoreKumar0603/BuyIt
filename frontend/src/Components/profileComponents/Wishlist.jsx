import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

export const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  // ✅ Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/wishlist/my-wishlist", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch wishlist");

        const data = await res.json();
        setWishlist(data);

        // Update localStorage after fetching from the server
        localStorage.setItem("wishlist", JSON.stringify(data));
      } catch (error) {
        console.error("❌ Error fetching wishlist:", error.message);

        // Fallback to localStorage if API fetch fails
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
      }
    };

    fetchWishlist();
  }, []);

  // ✅ Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const res = await fetch("http://localhost:5000/api/wishlist/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error("Failed to remove item");

      setWishlist((prev) => {
        const updatedWishlist = prev.filter((item) => item._id !== productId);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); // Update localStorage
        return updatedWishlist;
      });
    } catch (err) {
      console.error("❌ Error removing from wishlist:", err.message);
    }
  };

  // ✅ Move to Cart and remove from wishlist
  const moveToCart = async (productId, category) => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Add to cart
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          category,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add to cart");
      }

      // 2️⃣ Remove from wishlist
      await removeFromWishlist(productId);
    } catch (err) {
      console.error("❌ Error moving to cart:", err.message);
    }
  };

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
                    {item.title?.length > 25 ? item.title.slice(0, 25) + "..." : item.title}
                  </h6>
                  <p className="text-muted small">
                    {"Specs"}
                  </p>
                  <p className="mb-1">
                    <span className="text-decoration-line-through text-muted me-1">
                      ₹{item.originalPrice || item.price + 100}
                    </span>
                    <strong>₹{item.price}</strong>
                  </p>
                  <p className="text-success fw-bold">
                    {item.discount || "10% OFF"}
                  </p>
                  <Button variant="dark" onClick={() => moveToCart(item._id, item.category)}>
                    Move to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
