import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";



import Oppo from '../../assets/images/oppo.png'
export const Wishlist = () => {
  const [wishlist, setWishlist] = useState([
    { id: 1, name: "Oppo F11", specs: "6Ram | 128 Rom | 6.57inc", price: 500, originalPrice: 609, discount: "54% off", img: Oppo  },
    { id: 2, name: "Oppo F11", specs: "6Ram | 128 Rom | 6.57inc", price: 500, originalPrice: 609, discount: "54% off", img: "https://via.placeholder.com/150" },
    { id: 3, name: "Oppo F11", specs: "6Ram | 128 Rom | 6.57inc", price: 500, originalPrice: 609, discount: "54% off", img: "https://via.placeholder.com/150" },
    { id: 4, name: "Oppo F11", specs: "6Ram | 128 Rom | 6.57inc", price: 500, originalPrice: 609, discount: "54% off", img: "https://via.placeholder.com/150" },
    { id: 5, name: "Oppo F11", specs: "6Ram | 128 Rom | 6.57inc", price: 500, originalPrice: 609, discount: "54% off", img: "https://via.placeholder.com/150" },
    { id: 6, name: "Oppo F11", specs: "6Ram | 128 Rom | 6.57inc", price: 500, originalPrice: 609, discount: "54% off", img: "https://via.placeholder.com/150" },
  ]);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <div className="container">
      <div className="row">
        {wishlist.map((item) => (
          <div key={item.id} className="col-md-4 col-sm-6 col-12 mb-4">
            <div className="card position-relative shadow-sm d-flex justify-content-center p-4">
              {/* Remove Button */}
              <button className="btn-close position-absolute top-0 end-0 m-2" onClick={() => removeFromWishlist(item.id)}></button>

              {/* Product Image */}
              <img src={item.img} className="card-img-center img-fluid" alt={item.name}/>

              {/* Product Details */}
              <div className="card-body text-center">
                <h6 className="card-title mb-1">{item.name}</h6>
                <p className="text-muted small">{item.specs}</p>
                <p className="mb-1">
                  <span className="text-decoration-line-through text-muted me-1">${item.originalPrice}</span>
                  <strong>${item.price}</strong>
                </p>
                <p className="text-success fw-bold">{item.discount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};