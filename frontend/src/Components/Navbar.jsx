import React from "react";
import { NavLink } from "react-router-dom";
import { FaShoppingCart, FaBoxOpen, FaSearch } from "react-icons/fa";
import '../assets/css/components/Navbar.css';

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4 mb-4">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        
        {/* Brand Name (Left) */}
        <NavLink className="navbar-brand fw-bold fs-4 text-dark" to="/">
          BuyIt
        </NavLink>

        {/* Search Bar (Center) */}
        <div className="d-none d-md-flex flex-grow-1 justify-content-md-center">
          <div className="input-group w-50">
            <span className="input-group-text border-0 bg-for-search">
              <FaSearch size={14} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-0 bg-for-search"
              placeholder="Search products, brands and more"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Navigation Links (Right) */}
        <div className="d-flex align-items-center w-25 justify-content-around">
          <NavLink className="nav-link text-dark fw-semibold" to="/login">
            Login
          </NavLink>
          <NavLink className="nav-link text-dark d-flex align-items-center" to="/cart">
            <FaShoppingCart size={18} className="me-1" /> Cart
          </NavLink>
          <NavLink className="nav-link text-dark d-flex align-items-center" to="/orders">
            <FaBoxOpen size={18} className="me-1" /> Orders
          </NavLink>
        </div>

      </div>
    </nav>
  );
};
