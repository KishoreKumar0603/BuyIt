import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { updateCartItem, removeFromCart } from "../../api/cartApi";

export const CartList = () => {
  const { cartItems, setCartItems, setTotalPrice, setIsProductAvail } =
    useCart();
  const [loadingItems, setLoadingItems] = useState(new Set());

  const token = localStorage.getItem("token");

  const handleQuantityChange = async (itemId, change) => {
    const updatedItems = cartItems.map((item) => {
      if (item._id === itemId) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCartItems(updatedItems);
    setLoadingItems((prev) => new Set(prev).add(itemId));

    const changedItem = updatedItems.find((item) => item._id === itemId);

    try {
      await updateCartItem(changedItem.product._id, changedItem.quantity);

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );
      setTotalPrice(newTotal);
    } catch (error) {
      console.error("❌ Error updating quantity:", error.message);
      // Revert the change on error
      setCartItems(cartItems);
    } finally {
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemove = async (itemId) => {
    const removedItem = cartItems.find((item) => item._id === itemId);
    setLoadingItems((prev) => new Set(prev).add(itemId));

    try {
      await removeFromCart(removedItem.product._id);

      const newItems = cartItems.filter((item) => item._id !== itemId);
      setCartItems(newItems);
      setIsProductAvail(newItems.length > 0);

      const newTotal = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );
      setTotalPrice(newTotal);
    } catch (error) {
      console.error("❌ Error removing item:", error.message);
    } finally {
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  return (
    <div className="container p-3">
      <div
        className="cart-scroll-container"
        style={{
          maxHeight: "100vh",
          overflowY: "auto",
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
                <p className="secondary m-0 p-0">
                  Rating: {item.product?.rating || "N/A"}
                </p>
                <p className="text-muted mb-0">
                  Stock: {item.product?.stock || 0}
                </p>
                <h4 className="mb-3">₹ {item.product?.price || 0}</h4>
              </div>
              <div className="col-md-12 mt-2">
                <div className="row">
                  <div className="col-4 d-flex justify-content-center align-items-center">
                    <button
                      className="btn btn-light border me-2"
                      onClick={() => handleQuantityChange(item._id, -1)}
                      disabled={
                        item.quantity <= 1 || loadingItems.has(item._id)
                      }
                    >
                      {loadingItems.has(item._id) ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        "-"
                      )}
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-light border ms-2"
                      onClick={() => handleQuantityChange(item._id, 1)}
                      disabled={
                        item.quantity >= item.product?.stock ||
                        loadingItems.has(item._id)
                      }
                      title={
                        item.quantity >= item.product?.stock
                          ? `Only ${item.product?.stock} left in stock`
                          : ""
                      }
                    >
                      {loadingItems.has(item._id) ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        "+"
                      )}
                    </button>
                  </div>
                  <div className="col-8">
                    <Link
                      to={`/products/${item.category}/${item.product?._id}`}
                    >
                      <Button variant="dark">View</Button>
                    </Link>
                    <Button
                      variant="dark"
                      className="ms-3"
                      onClick={() => handleRemove(item._id)}
                      disabled={loadingItems.has(item._id)}
                    >
                      {loadingItems.has(item._id) ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Removing...
                        </>
                      ) : (
                        "Remove"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
