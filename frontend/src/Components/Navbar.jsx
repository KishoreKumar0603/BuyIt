import React, { useState, useEffect, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaBoxOpen,
  FaSearch,
  FaHeart,
  FaUser,
  FaBars,
  FaSignOutAlt
} from "react-icons/fa";
import '../assets/css/components/Navbar.css';
import { jwtDecode } from "jwt-decode";
import { SearchBar } from "./SearchBar";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
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
            setUser(null);
            navigate("/login");
          } else {
            setUser({ email: decodedToken.email, id: decodedToken._id });
          }
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          setUser(null);
          navigate("/login");
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, [navigate, setUser]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".nav-item.dropdown")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4">
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-bold fs-4 text-dark w-25" to="/">
          BuyIt
        </NavLink>

        <button className="navbar-toggler" type="button" onClick={handleToggle}>
          <FaBars />
        </button>

        <div className={`collapse navbar-collapse ${isCollapsed ? "" : "show"}`} id="navbarNav">
          <div className="d-flex flex-column flex-lg-row w-100 justify-content-lg-between align-items-lg-center">
            <div className="d-none d-md-flex w-50 justify-content-md-center">
              <SearchBar />
            </div>

            <ul className="navbar-nav d-md-flex justify-content-md-around w-50">
              {!user ? (
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
                        <NavLink
                          className="dropdown-item"
                          to="/profile/personal"
                          onClick={() => setShowDropdown(false)}
                        >
                          <FaUser size={14} className="me-2" /> Profile
                        </NavLink>
                      </li>
                      <li>
                        <span
                          className="dropdown-item text-danger"
                          onClick={() => {
                            setShowDropdown(false);
                            handleLogout();
                          }}
                        >
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


