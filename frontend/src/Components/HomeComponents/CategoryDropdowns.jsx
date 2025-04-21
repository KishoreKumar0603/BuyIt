import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import "../../assets/css/components/CategoryDropdowns.css";

const categories = [
  { label: 'Fashions', img: '/images/DropDowns/Fashion.png' },
  { label: 'Phones', img: '/images/DropDowns/phones.png' },
  { label: 'Appliances', img: '/images/DropDowns/Appliances.png' },
  { label: 'Kitchen', img: '/images/DropDowns/Kitchen.png' },
  { label: 'Toys', img: '/images/DropDowns/Toys.png' },
];

const CategoryDropdowns = () => {
  return (
    <div className="category-container box py-3 d-flex justify-content-around align-items-center">
      {categories.map((cat, index) => (
        <Link
          to={`/products/mobiles`}
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
