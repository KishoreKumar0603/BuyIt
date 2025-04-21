import React from 'react';

const banners = [
  { img: '/images/Banner/Banner_2.jpg', alt: 'Flash Sale Banner 2' },
  { img: '/images/Banner/Banner_1.jpg', alt: 'Flash Sale Banner 1' },
  // { img: '/images/Banner/Banner_3.png', alt: 'Flash Sale Banner 3' }
];

const HeroBanner = () => {
  return (
    <div id="heroCarousel" className="carousel slide mt-5 rounded overflow-hidden box" data-bs-ride="carousel">
      <div className="carousel-inner">
        {banners.map((banner, index) => (
          <div
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
            key={index}
          >
            <img
              src={banner.img}
              className="d-block w-100"
              alt={banner.alt}
              style={{ objectFit: 'fit', height: '260px' }}
            />
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>
  );
};

export default HeroBanner;
