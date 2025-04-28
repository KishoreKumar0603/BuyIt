// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { SlControlStart } from "react-icons/sl";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isProductAvail, setIsProductAvail] = useState(null);

  const fetchCart = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch cart: ${res.status}`);
      const data = await res.json();
      const items = data.items || [];
      // console.log("Items");
      // items.map((item) =>{
      //   console.log(item);
      // });
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
