import React, { useEffect } from "react";
import "../assets/css/pages/NotFound.css";
import { NavLink } from "react-router-dom";
export const NotFound = () => {
  useEffect(()=>{
    document.title = "Page Not Found";
  })
  return (
    <>
      <div className="not-found-container">
        <h1>Page Not Found | 404</h1>
        <NavLink to={"/"}>back to Home -{">"}</NavLink>
      </div>
    </>
  );
};
