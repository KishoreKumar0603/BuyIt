import React from "react";
import { NavLink } from "react-router-dom";
import '../../assets/css/pages/Profile.css';
export const Sidebar = () => {
  return (
    <div className="bg-white py-4 d-flex flex-column align-items-center shadow-sm box">
      <ul className="list-unstyled w-100 text-center">
        <li className="py-3 fs-5 w-100 sidebar-item">
          <NavLink to="personal" className="text-decoration-none sidebar-link">Personal</NavLink>
        </li>
        <li className="py-3 fs-5 w-100 sidebar-item">
          <NavLink to="cart" className="text-decoration-none sidebar-link">Cart</NavLink>
        </li>
        <li className="py-3 fs-5 w-100 sidebar-item">
          <NavLink to="wishlist" className="text-decoration-none sidebar-link">Wishlist</NavLink>
        </li>
        <li className="py-3 fs-5 w-100 sidebar-item">
          <NavLink to="payments" className="text-decoration-none sidebar-link">Payments</NavLink>
        </li>
        <li className="py-3 fs-5 w-100 sidebar-item">
          <NavLink to="address" className="text-decoration-none sidebar-link">Address</NavLink>
        </li>
        <li className="py-3 fs-5 w-100 sidebar-item">
          <NavLink to="password" className="text-decoration-none sidebar-link">Password</NavLink>
        </li>
        <li className="py-3 fs-5 w-100 sidebar-item">
          <NavLink to="settings" className="text-decoration-none sidebar-link">Settings</NavLink>
        </li>
      </ul>
    </div>
  );
};
