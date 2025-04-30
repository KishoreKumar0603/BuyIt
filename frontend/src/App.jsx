import "./App.css";
import Login from "./pages/Login.jsx";
import { BrowserRouter as Router, Route, Routes, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
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
import { RootCart } from "./Components/CartComponents/RootCart.jsx";
import { Order } from "./Components/Order/Order.jsx";
import { RootWishlist } from "./Components/Wishlist/RootWishlist.jsx";
import HomeRootLayout from "./layout/HomeRootLayout.jsx";
import { ProductListing } from "./Components/ProductComponents/ProductListing.jsx";
import { ProductDetails } from "./Components/ProductComponents/ProductDetails.jsx";
import { OrderSuccess } from "./Components/CartComponents/OrderSuccess.jsx";
import { useAlert } from "./context/AlertContext.jsx";
import Alert from "./Components/Alert.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootLayout />} >
          <Route index element={<HomeRootLayout />}/>

          <Route element={<PrivateRoute />}>
            <Route path="products/:category" element={<ProductListing />} />
            <Route path="products/:category/:id" element={<ProductDetails />} />
            <Route path="cart" element={<RootCart /> } />
            <Route path="order-success" element={<OrderSuccess /> } />
            <Route path="orders" element={<Order /> } />
            <Route path="wishlist" element={<RootWishlist />} />
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

  return(
    <>
   <RouterProvider router={router} />
   <CustomAlertWrapper />
    </>
  );
}


const CustomAlertWrapper = () => {
  const { alertMessage, showAlert, closeAlert } = useAlert();

  return (
    <Alert
      message={alertMessage}
      show={showAlert}
      onClose={closeAlert}
    />
  );
};

export default App;