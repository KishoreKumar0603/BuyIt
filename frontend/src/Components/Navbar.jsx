import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBoxOpen, FaSearch, FaHeart, FaUser, FaBars, FaHome, FaSignOutAlt } from "react-icons/fa";
import '../assets/css/components/Navbar.css';
import { jwtDecode } from "jwt-decode";

import { SearchBar } from "./SearchBar";
export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            localStorage.removeItem("token"); 
            setIsLoggedIn(false);
            navigate("/login");
          } else {
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          navigate("/login");
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth(); // Run on mount
    const interval = setInterval(checkAuth, 60000); // Check every 60 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [navigate]);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4 mb-4">
      <div className="container-fluid">
        
        {/* Brand Name */}
        <NavLink className="navbar-brand fw-bold fs-4 text-dark w-25" to="/">
          BuyIt
        </NavLink>

        {/* Navbar Toggler Button */}
        <button className="navbar-toggler" type="button" onClick={handleToggle}>
          <FaBars />
        </button>

        {/* Collapsible Navbar Content */}
        <div className={`collapse navbar-collapse ${isCollapsed ? "" : "show"}`} id="navbarNav">
          <div className="d-flex flex-column flex-lg-row w-100 justify-content-lg-between align-items-lg-center">
            
            {/* Search Bar */}
            {/* Search Bar */}
            {/* <div className="d-none d-md-flex w-50 justify-content-md-center">
              <SearchBar />
            </div> */}
            <div className="d-none d-md-flex w-50 justify-content-md-center">
              <div className="input-group">
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

            {/* Navigation Links */}
            <ul className="navbar-nav d-md-flex justify-content-md-around w-50">
              {!isLoggedIn ? (
                <li className="nav-item">
                  <NavLink className="nav-link text-dark fw-semibold" to="/login">
                    Login
                  </NavLink>
                </li>
              ) : (
                <li className="nav-item dropdown">
                  <span 
                    className="nav-link text-dark d-flex align-items-center dropdown-toggle" 
                    role="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <FaUser size={18} className="me-1" /> Profile
                  </span>
                  {showDropdown && (
                    <ul className="dropdown-menu show">
                      <li>
                        <NavLink className="dropdown-item" to="/profile/personal">
                          <FaUser size={14} className="me-2" /> Profile
                        </NavLink>
                      </li>
                      <li>
                        <span className="dropdown-item text-danger" onClick={handleLogout}>
                          <FaSignOutAlt size={14} className="me-2" /> Logout
                        </span>
                      </li>
                    </ul>
                  )}
                </li>
              )}
              <li className="nav-item">
                <NavLink className="nav-link text-dark d-flex align-items-center" to="/wishlist">
                  <FaHeart size={18} className="me-1" /> Wishlist
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-dark d-flex align-items-center" to="/cart">
                  <FaShoppingCart size={18} className="me-1" /> Cart
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-dark d-flex align-items-center" to="/orders">
                  <FaBoxOpen size={18} className="me-1" /> Orders
                </NavLink>
              </li>
            </ul>

          </div>
        </div>
      </div>
    </nav>
  );
};
