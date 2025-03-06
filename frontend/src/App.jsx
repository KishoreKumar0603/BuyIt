import './App.css'
import Login from './pages/Login.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup.jsx'

import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import OtpVerification from "./pages/ForgotPassword/OtpVerification";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
// import { ForgotPassword,OtpVerification,ResetPassword} from './pages/Auth.jsx';
// import ForgotPasswordFlow from './pages/Auth.jsx';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
