import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import "../../assets/css/components/CategoryDropdowns.css";

const categories = [
  { label: 'Fashions', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817485/Fashion_z5hrlw.png', collection:"fashions"},
  { label: 'Phones', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817484/phones_hmy4tv.png', collection:"mobiles" },
  { label: 'Appliances', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817484/Appliances_gllqra.png', collection:"appliances" },
  { label: 'Kitchen', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817483/Kitchen_nwmpsl.png', collection:"kitchens" },
  { label: 'Toys', img: 'https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817485/Toys_qzuir4.png', collection:"toys" },
];

const CategoryDropdowns = () => {
  return (
    <div className="category-container box py-3 d-flex justify-content-around align-items-center">
      {categories.map((cat, index) => (
        <Link
          to={`/products/${cat.collection}`}
          key={index}
          className="category-item text-center px-3 text-decoration-none text-dark"
        >
          <img
            src={cat.img}
            alt={cat.label}
            className="img-fluid category-img mb-2"
            style={{ height: '80px', objectFit: 'contain' }}
          />
          <div className="fw-medium d-flex justify-content-center align-items-center gap-1">
            {cat.label}
            <FaChevronDown style={{ fontSize: '0.7rem' }} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryDropdowns;
