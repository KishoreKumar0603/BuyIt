import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../../context/cartContext";

export const CartList = () => {
  const { cartItems, setCartItems, setTotalPrice, setIsProductAvail } =
    useCart();

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

    const changedItem = updatedItems.find((item) => item._id === itemId);

    try {
      await fetch(`http://localhost:5000/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: changedItem.product._id,
          quantity: changedItem.quantity,
          price: changedItem.product.price,
        }),
      });

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      setTotalPrice(newTotal);
    } catch (error) {
      console.error("❌ Error updating quantity:", error.message);
    }
  };

  const handleRemove = async (itemId) => {
    const removedItem = cartItems.find((item) => item._id === itemId);
    try {
      await fetch(
        `http://localhost:5000/api/cart/remove/${removedItem.product._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newItems = cartItems.filter((item) => item._id !== itemId);
      setCartItems(newItems);
      setIsProductAvail(newItems.length > 0);

      const newTotal = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      setTotalPrice(newTotal);
    } catch (error) {
      console.error("❌ Error removing item:", error.message);
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
                    <Link
                      to={`/products/${item.category}/${item.product?._id}`}
                    >
                      <Button variant="dark">View</Button>
                    </Link>
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
    </div>
  );
};
