import "./App.css";
import Login from "./pages/Login.jsx";
import { BrowserRouter as Router, Route, Routes, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import OtpVerification from "./pages/ForgotPassword/OtpVerification";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import Otp from "./pages/ForgotPassword/Otp.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { RootLayout } from "./layout/RootLayout.jsx";
import ProfileLayout from "./layout/ProfileLayout.jsx";
import {Personal} from './Components/profileComponents/Personal.jsx';
import { Navigate } from "react-router-dom";
import { Cart } from "./Components/profileComponents/Cart.jsx";
import { Wishlist } from "./Components/profileComponents/Wishlist.jsx";
import { Payments } from "./Components/profileComponents/Payments.jsx";
import { Address } from "./Components/profileComponents/Address.jsx";
import { Password } from "./Components/profileComponents/Password.jsx";
import { Settings } from "./Components/profileComponents/Settings.jsx";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootLayout />} >
          <Route index element= {<Home />} />
          <Route path="profile" element={<ProfileLayout />}>
            <Route index element={<Navigate to="personal" replace />} />
            <Route path="personal" element={<Personal />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="payments" element={<Payments />} />
            <Route path="address" element={<Address />} />
            <Route path="password" element={<Password />} />
            <Route path="settings" element={<Settings />} />
          </Route>

        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp-verify" element={<Otp />} />
        <Route path="*" element={<NotFound />} />
      </>
    )
  )

  return <RouterProvider router={router} ></RouterProvider>


  // return (
  //   <>
  //     <Router>
  //       <Routes>
  //         <Route path="/" element={<Home />} />
  //         <Route path="/login" element={<Login />} />
  //         <Route path="/signup" element={<Signup />} />
  //         <Route path="/forgot-password" element={<ForgotPassword />} />
  //         <Route path="/otp-verification" element={<OtpVerification />} />
  //         <Route path="/reset-password" element={<ResetPassword />} />
  //         <Route path="/otp-verify" element={<Otp />} />
  //         <Route path="*" element={<NotFound />} />
  //       </Routes>
  //     </Router>
  //   </>
  // );
}

export default App;
