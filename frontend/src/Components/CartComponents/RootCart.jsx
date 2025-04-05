import React from "react";
import PlaceOrderBox from "./PlaceOrderBox";
import PriceDetails from "./PriceDetails";
import { Cart } from "../profileComponents/Cart";
import EmptyCartImage from "../../assets/images/cart-not-found.png";

export const RootCart = () => {
  // Dummy cartItems array (replace with real logic or props/context)
  const cartItems = []; // example: [{id: 1, name: "Item"}]

  return (
    <div className="container my-4">
      {cartItems.length === 0 ? (
        <div className="text-center">
          <img
            src={EmptyCartImage}
            alt="Empty Cart"
            style={{ width: "200px", maxWidth: "100%" }}
          />
          <h5 className="mt-3 fw-semibold">Oops Cart Is Empty !</h5>
        </div>
      ) : (
        <div className="row mt-3">
          <div className="col-md-8">
            <PlaceOrderBox />
            <Cart />
          </div>
          <div className="col-md-4">
            <PriceDetails
              price={999}
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
