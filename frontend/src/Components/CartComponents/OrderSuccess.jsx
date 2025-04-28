import React from "react";
import { MdCheckCircle } from "react-icons/md";
import { Link } from "react-router-dom";

export const OrderSuccess = () => {
  return (
    <div className="vh-100">
      <div className="bg-white container p-5 box text-center h-75 w-50 d-flex flex-column justify-content-center align-items-center ">
        <MdCheckCircle size={80} color="black" className="mb-3" />
        <h3 className="mb-2 fw-semibold">Order Placed</h3>
        <Link to="/orders" className="text-decoration-underline text-dark small">
          ← View Orders
        </Link>
      </div>
    </div>
  );
};


