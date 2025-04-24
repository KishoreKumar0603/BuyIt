import React, { useState, useEffect } from "react";
import PlaceOrderBox from "./PlaceOrderBox";
import PriceDetails from "./PriceDetails";
import { CartList } from "./CartList";

export const RootCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isProductAvail, setIsProductAvail] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();
        const items = data.items || [];

        setCartItems(items);
        setIsProductAvail(items.length > 0);

        const initialTotal = items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        setTotalPrice(initialTotal);
      } catch (err) {
        console.error("❌ Error loading cart:", err.message);
        setIsProductAvail(false);
      }
    };

    if (token) fetchCart();
  }, [token]);

  return (
    <div className="container my-4">
      <div className="row mt-3">
        <div className="col-md-8">
          <PlaceOrderBox
            cartItems={cartItems}
            setCartItems={setCartItems}
            setIsProductAvail={setIsProductAvail}
          />
          <CartList
            cartItems={cartItems}
            setCartItems={setCartItems}
            setTotalPrice={setTotalPrice}
            setIsProductAvail={setIsProductAvail}
          />
        </div>
        <div className="col-md-4">
          <PriceDetails
            price={totalPrice}
            offer={20}
            platformFee={3}
            deliveryCharges={15}
          />
        </div>
      </div>
      {isProductAvail === false && (
        <div className="text-center mt-4">
          <h5>Your Cart is Empty</h5>
        </div>
      )}
    </div>
  );
};
