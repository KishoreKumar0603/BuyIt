import React from "react";

const PriceDetails = ({ price, offer, platformFee, deliveryCharges }) => {
  const total = price - offer + platformFee + deliveryCharges;

  return (
    <div className="card p-4 shadow-sm border-0">
      <h6 className="text-muted fw-bold">Price Details</h6>
      <hr />
      <div className="d-flex justify-content-between">
        <span>Price (1 item)</span>
        <span className="">${price}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span>Offer</span>
        <span className="text-success ">-${offer}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span>Platform fee</span>
        <span className="">${platformFee}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span>Delivery Charges</span>
        <span className="">${deliveryCharges}</span>
      </div>
      <hr className="border-dashed my-2" />
      <div className="d-flex justify-content-between mt-2">
        <h5 className="">Total</h5>
        <h5 className="">${total}</h5>
      </div>
    </div>
  );
};

export default PriceDetails;
