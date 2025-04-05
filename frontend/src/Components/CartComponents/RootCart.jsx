import React from "react";
import PlaceOrderBox from "./PlaceOrderBox";
import PriceDetails from "./PriceDetails";
import {Cart} from '../profileComponents/Cart';
export const RootCart = () => {
 
  return (
    <div className="container my-4">
      <div className="row mt-3">
        <div className="col-md-8">
          <PlaceOrderBox />
          <Cart />
        </div>
        <div className="col-md-4">
          <PriceDetails price={999} offer={20} platformFee={3} deliveryCharges={15} />
        </div>
      </div>
    </div>
  );
};
