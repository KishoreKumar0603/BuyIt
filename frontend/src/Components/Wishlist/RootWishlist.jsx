import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "../../assets/css/components/Wishlist.css";

const initialProducts = Array(12).fill({
  title: "Oppo F11 | 6ram | 128 rom | 6.57inc",
  oldPrice: "$609",
  newPrice: "$500",
  discount: "54% off",
});

export const RootWishlist = () => {
  const [products, setProducts] = useState(initialProducts);

  const handleRemove = (indexToRemove) => {
    const updatedProducts = products.filter((_, index) => index !== indexToRemove);
    setProducts(updatedProducts);
  };

  return (
    <div className="container py-4">
      <div className="row">
        {products.map((product, index) => (
          <div key={index} className="col-6 col-md-3 mb-4">
            <div className="card position-relative p-2">
              {/* Close button */}
              <FaTimes
                size={14}
                className="position-absolute top-0 end-0 m-2 text-muted"
                style={{ cursor: "pointer" }}
                onClick={() => handleRemove(index)}
              />

              {/* Image placeholder */}
              <div
                className="bg-light mb-2"
                style={{ width: "100%", paddingTop: "100%" }}
              ></div>

              {/* Product details */}
              <p className="mb-1 fw-medium small">{product.title}</p>
              <p className="mb-1 small text-muted">
                <s>{product.oldPrice}</s>{" "}
                <span className="fw-bold text-dark">{product.newPrice}</span>{" "}
                <span className="text-success">{product.discount}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
