import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../context/axiosInstance";
import { useAlert } from "../../context/AlertContext";

const PlaceOrderBox = ({ cartItems, setCartItems, setTotalPrice, setIsProductAvail }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const {triggerAlert} = useAlert();

  const handlePlaceOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      // alert("Your cart is empty! Please add items before placing an order.");
      triggerAlert("Your cart is empty! Please add items before placing an order.")
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/api/orders/place",
        {
          products: cartItems.map((item) => ({
            productId: item.product._id,
            category: item.category,
            quantity: item.quantity,
          })),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Clear the cart and reset relevant states
        setCartItems([]);
        setTotalPrice(0);
        setIsProductAvail(false);

        // alert(response.data.message || "Order placed successfully!");
        triggerAlert(response.data.message || "Order placed successfully!");
        navigate("/order-success");
      } else {
        // alert(response.data.error || "Error placing order. Please try again.");
        triggerAlert(response.data.error || "Error placing order. Please try again.");
      }
    } catch (error) {
      // alert((error.response && error.response.data && error.response.data.error) || error.message ||"An unexpected error occurred."
      // );
      triggerAlert((error.response && error.response.data && error.response.data.error) || error.message ||"An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-3">
      <div className="container box px-4 py-3 d-flex justify-content-between align-items-center">
        <span>Click the "Place Order" button to complete your order.</span>
        <button
          className="btn btn-dark"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default PlaceOrderBox;
