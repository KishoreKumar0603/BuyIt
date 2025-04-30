import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../Components/Navbar";
import { Footer } from "../Components/HomeComponents/Footer";

export const RootLayout = () => {
  useEffect(()=>{
    document.title="BuyIt | Home";
  },[])
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
