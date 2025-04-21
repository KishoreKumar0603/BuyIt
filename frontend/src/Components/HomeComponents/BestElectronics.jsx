import React from 'react';

const electronics = [
  { title: 'Monitors', price: '$100', img: '/images/BestElectronic/Monitor.png' },
  { title: 'Television', price: '$90', img: '/images/BestElectronic/Tv.png' },
  { title: 'Mobiles', price: '$120', img: '/images/BestElectronic/mobiles.png' },
  { title: 'Laptops', price: '$300', img: '/images/BestElectronic/laptops.png' },
];

const BestElectronics = () => {
  return (
    <div className="p-4  mt-5 box">
      <h5 className="mb-4 px-2">Best Electronics</h5>
      <div className="row justify-content-between">
        {electronics.map((item, i) => (
          <div key={i} className="col-6 col-md-3 text-center mb-3">
            <img
              src={item.img}
              alt={item.title}
              className="img-fluid mb-2"
              style={{ height: '150px', objectFit: 'contain' }}
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

export default BestElectronics;
