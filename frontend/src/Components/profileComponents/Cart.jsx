import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Oppo from '../../assets/images/oppo.png';

export const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Oppo F11 mobile  16Ram | 128 Rom | 6.67inc",
      brand: "Oppo",
      rating: "3.4 / 5",
      price: 933,
      quantity: 1,
    },
    {
      id: 2,
      name: "Oppo F11 mobile  16Ram | 128 Rom | 6.67inc",
      brand: "Oppo",
      rating: "3.4 / 5",
      price: 933,
      quantity: 1,
    },
    {
      id: 3,
      name: "Oppo F11 mobile  16Ram | 128 Rom | 6.67inc",
      brand: "Oppo",
      rating: "3.4 / 5",
      price: 933,
      quantity: 1,
    },
  ]);

  const handleQuantityChange = (id, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div className="container px-4">
      {cartItems.map((item) => (
        <div key={item.id} className="card p-3 mb-3 box">
          <div className="row">
            <div className="col-md-2 d-flex align-items-center">
              <img src={Oppo} alt="" className="h-100 w-100"/>
            </div>
            <div className="col-md-6">
              <h5>{item.name}</h5>
              <p className="secondary">Brand: {item.brand}</p>
              <p className="secondary">Rating: {item.rating}</p>
              <h4>${item.price}</h4>
            </div>
            <div className="col-md-12 mt-2">
              <div className="row">
                <div className="col-2 d-flex justify-content-center align-items-center">
                  <button
                    className="btn btn-light border me-2"
                    onClick={() => handleQuantityChange(item.id, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="btn btn-light border ms-2"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                <div className="col-10">
                <Button variant="dark" className="">Order</Button>
                <Button variant="dark" className="ms-3" onClick={() => handleRemove(item.id)}>Remove</Button>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
