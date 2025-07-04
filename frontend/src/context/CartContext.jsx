// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isProductAvail, setIsProductAvail] = useState(null);

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;
      const items = data.items || [];
      setCartItems(items);
      setIsProductAvail(items.length > 0);

      const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      setTotalPrice(total);
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err.message);
    }
  };

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        totalPrice,
        setTotalPrice,
        isProductAvail,
        setIsProductAvail,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
