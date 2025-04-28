import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const PlaceOrderBox = ({ cartItems, setCartItems, setTotalPrice, setIsProductAvail }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); 
  const handlePlaceOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty! Please add items before placing an order.");
      return;
    }

    setLoading(true);

    try {
      
      // cartItems.map((item) =>{
      //   console.log("product :"+item.product);
      // })
      const response = await fetch("http://localhost:5000/api/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: cartItems.map((item) => ({
            productId: item.product._id,
            category: item.category,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json(); // Get the response data (either success or error)

      if (response.ok) {
        // Clear the cart and reset relevant states if the order is placed successfully
        setCartItems([]);
        setTotalPrice(0);
        setIsProductAvail(false);

        // Show success alert
        alert(data.message || "Order placed successfully!");

        // Navigate to the order success page
        navigate("/order-success");
      } else {
        // Show error alert if response is not OK (order failed)
        alert(data.error || "Error placing order. Please try again.");
      }
    } catch (error) {
      // Show generic error alert if an error occurs during the fetch call
      alert(error.message || "An unexpected error occurred.");
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
