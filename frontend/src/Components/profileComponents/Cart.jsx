import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../context/axiosInstance";

export const Cart = () => {
  const { token } = useOutletContext();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCartItems(response.data.items || []);
        console.log(response.data.items);
      } catch (err) {
        console.error("❌ Failed to load cart", err.message);
      }
    };

    if (token) fetchCart();
  }, [token]);

  const handleQuantityChange = async (itemId, change) => {
    const updatedItems = cartItems.map((item) => {
      if (item._id === itemId) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCartItems(updatedItems);
    const changedItem = updatedItems.find((item) => item._id === itemId);

    try {
      const response = await axiosInstance.put(
        `/api/cart/update`,
        {
          productId: changedItem.product._id,
          quantity: changedItem.quantity,
          price: changedItem.product.price,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) throw new Error("Quantity update failed");
    } catch (error) {
      console.error("❌ Error updating quantity:", error.message);
    }
  };

  const handleRemove = async (itemId) => {
    const removedItem = cartItems.find((item) => item._id === itemId);
    try {
      const response = await axiosInstance.delete(
        `api/cart/remove/${removedItem.product._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) throw new Error("Failed to delete item");

      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
    } catch (error) {
      console.error("❌ Error removing item:", error.message);
    }
  };

  return (
    <div className="container px-4">
      {cartItems.length === 0 ? (
        <h4>Your cart is empty 😔</h4>
      ) : (
        <div
          className="cart-scroll-container"
          style={{
            maxHeight: "100vh",
            overflowY: "auto",
            paddingRight: "10px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {cartItems.map((item) => (
            <div key={item._id} className="card p-3 mb-3 box">
              <div className="row">
                <div className="col-md-4 d-flex align-items-center justify-content-center">
                  <img
                    src={item.product?.image_url}
                    alt=""
                    className="h-50 w-50"
                  />
                </div>
                <div className="col-md-8">
                  <h5>
                    {(item.product?.title || "Product Name").slice(0, 90)}
                    {item.product?.title?.length > 60 ? "..." : ""}
                  </h5>
                  <p className="secondary m-0">
                    Brand: {item.product?.brand || "Brand"}
                  </p>
                  <p className="secondary m-0">
                    Rating: {item.product?.rating || "N/A"}
                  </p>
                  <p className="text-muted">
                    Stock: {item.product?.stock || 0}
                  </p>
                  <h4 className="m-0">₹ {item.product?.price || 0}</h4>
                </div>
                <div className="col-md-12 mt-2">
                  <div className="row">
                    <div className="col-4 d-flex justify-content-center align-items-center">
                      <button
                        className="btn btn-light border me-2"
                        onClick={() => handleQuantityChange(item._id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-light border ms-2"
                        onClick={() => handleQuantityChange(item._id, 1)}
                        disabled={item.quantity >= item.product?.stock}
                        title={
                          item.quantity >= item.product?.stock
                            ? `Only ${item.product?.stock} left in stock`
                            : ""
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="col-8">
                      <Button variant="dark">Order</Button>
                      <Button
                        variant="dark"
                        className="ms-3"
                        onClick={() => handleRemove(item._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
