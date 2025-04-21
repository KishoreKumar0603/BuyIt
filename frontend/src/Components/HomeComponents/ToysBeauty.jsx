import React from 'react';

const toysBeauty = [
  { title: 'Plastic Toys', price: '$19', img: '/images/Beauty/plasticToys.png' },
  { title: 'Remote Cars', price: '$40', img: '/images/Beauty/remoteCar.png' },
  { title: 'Stationaries', price: '$3', img: '/images/Beauty/stationary.png' },
  { title: "Teddy's", price: '$30', img: '/images/Beauty/teddy.png' },
];

export const ToysBeauty = () => {
  return (
    <div className="p-4 box mt-5">
      <h5 className="mb-4 px-2">Toys & Beauty</h5>
      <div className="row justify-content-between">
        {toysBeauty.map((item, i) => (
          <div key={i} className="col-6 col-md-3 text-center mb-3">
            <img
              src={item.img}
              alt={item.title}
              className="img-fluid mb-2"
              style={{ height: '160px', objectFit: 'contain' }}
            />
            <h6 className="mb-1 fw-semibold">{item.title}</h6>
            <p className="text-dark fw-medium" style={{ fontSize: '0.95rem' }}>
              From <span className="fw-bold">{item.price}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
