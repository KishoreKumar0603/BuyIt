import React from "react";

const PlaceOrderBox = () => {
  return (
    <div className=" p-3">
        <div className="container box px-4 py-3 d-flex justify-content-between align-items-center">
            <span>Click Place Order Button to Complete</span>
            <button className="btn btn-dark">Place Order</button>
        </div>
    </div>
  );
};

export default PlaceOrderBox;
