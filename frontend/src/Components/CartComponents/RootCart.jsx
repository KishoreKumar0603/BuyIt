import React, { useEffect, useState } from "react";
import PlaceOrderBox from "./PlaceOrderBox";
import PriceDetails from "./PriceDetails";
import { CartList } from "./CartList";
import { useCart } from "../../context/CartContext";

export const RootCart = () => {
  const [loading, setLoading] = useState(true); // <-- NEW STATE

  useEffect(() => {
    document.title = `BuyIt | Cart`;
  }, []);

  const {
    cartItems,
    setCartItems,
    totalPrice,
    setTotalPrice,
    isProductAvail,
    setIsProductAvail,
    fetchCart,
  } = useCart();

  useEffect(() => {
    const loadData = async () => {
      await fetchCart(); // Assuming this fetches the cart items
      setLoading(false); // STOP LOADING AFTER DATA IS FETCHED
    };
    loadData();
  }, [fetchCart]);

  return (
    <div className="container my-4">
      {loading ? (
        <div className="d-flex justify-content-center" style={{ height: "300px" }}>
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : isProductAvail === false ? (
        <div className="text-center mt-4">
          <h5>Your Cart is Empty</h5>
        </div>
      ) : (
        <div className="row mt-3">
          <div className="col-md-8">
            <PlaceOrderBox
              cartItems={cartItems}
              setCartItems={setCartItems}
              setIsProductAvail={setIsProductAvail}
              setTotalPrice={setTotalPrice}
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
      )}
    </div>
  );
};
