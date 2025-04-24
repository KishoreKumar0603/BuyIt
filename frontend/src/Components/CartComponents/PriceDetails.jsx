import React from "react";

const PriceDetails = ({ price, offer, platformFee, deliveryCharges }) => {
  const total = price - offer + platformFee + deliveryCharges;

  return (
    <div className="card p-4 box border-0">
      <h6 className="">Price Details</h6>
      <hr style={{ borderTop: "2px dashed #999"}} />
      <div className="d-flex justify-content-between">
        <span>Price (1 item)</span>
        <span className="">₹{price}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span>Offer</span>
        <span className="text-success ">-₹{offer}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span>Platform fee</span>
        <span className="">₹{platformFee}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span>Delivery Charges</span>
        <span className="">₹{deliveryCharges}</span>
      </div>
      
      <hr style={{ borderTop: "2px dashed #999"}} />
      <div className="d-flex justify-content-between mt-2">
        <span className="">Total</span>
        <span className="">₹{total}</span>
      </div>
      
      <hr style={{ borderTop: "2px dashed #999"}} />
    </div>
  );
};

export default PriceDetails;
