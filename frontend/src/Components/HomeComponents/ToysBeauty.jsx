import React from 'react';
import { Link } from 'react-router-dom';

const toysBeauty = [
  { title: 'Plastic Toys', price: '90', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817592/plasticToys_sxsi8l.png', collection:"plastic_toys" },
  { title: 'Remote Cars', price: '300', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817592/remoteCar_aengtf.png', collection:"remote_cars" },
  { title: 'Stationaries', price: '10', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817593/stationary_qdfuy2.png', collection:"stationaries" },
  { title: "Teddy's", price: '200', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817591/teddy_ffeop6.png', collection:"teddy" },
];

export const ToysBeauty = () => {
  return (
    <div className="p-4 box mt-5">
      <h5 className="mb-4 px-2">Toys & Beauty</h5>
      <div className="row justify-content-between">
        {toysBeauty.map((item, i) => (
          <Link to={`/products/${item.collection}`} key={i} className="col-6 col-md-3 text-center mb-3 category-item text-dark text-decoration-none">
            <img
              src={item.img}
              alt={item.title}
              className="img-fluid mb-2"
              style={{ height: '160px', objectFit: 'contain' }}
            />
            <h6 className="mb-1 fw-semibold">{item.title}</h6>
            <p className="text-dark fw-medium" style={{ fontSize: '0.95rem' }}>
              From <span className="fw-bold">₹{item.price}</span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
