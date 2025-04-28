import React from 'react';

import { Link } from 'react-router-dom';

import "../../assets/css/components/CategoryDropdowns.css";

const electronics = [
  { title: 'Monitors', price: '2000', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817593/Monitor_ofmid9.png', collection:"monitors" },
  { title: 'Television', price: '5000', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817599/Tv_c4rbr0.png', collection:"tv" },
  { title: 'Mobiles', price: '7000', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817596/mobiles_mvsvdp.png', collection:"mobiles" },
  { title: 'Laptops', price: '10000', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817596/laptops_p2uhie.png', collection:"laptops" },
];

const BestElectronics = () => {
  return (
    <div className="p-4  mt-5 box">
      <h5 className="mb-4 px-2">Best Electronics</h5>
      <div className="row justify-content-between">
        {electronics.map((item, i) => (
          <Link 
          to={`/products/${item.collection}`}
          key={i} 
          className="category-item text-decoration-none text-dark col-6 col-md-3 text-center mb-3">
            <img
              src={item.img}
              alt={item.title}
              className="img-fluid mb-2"
              style={{ height: '150px', objectFit: 'contain' }}
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

export default BestElectronics;
