import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../Components/Navbar";
import { Footer } from "../Components/HomeComponents/Footer";

export const RootLayout = () => {
  return (
    <>
      <Navbar />
      <div className="home-layout py-5">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
