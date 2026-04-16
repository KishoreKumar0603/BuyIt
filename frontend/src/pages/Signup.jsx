import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/userApi";
import "../assets/css/pages/Signup.css";
import { useAlert } from "../context/AlertContext";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const Signup = () => {
  useEffect(() => {
    document.title = "BuyIt | SignUp";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { triggerAlert } = useAlert();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const data = await registerUser(
        formData.name,
        formData.email,
        formData.phone,
        formData.password,
      );

      setMessage(data.message);

      if (data.activationKey) {
        localStorage.setItem("activationKey", data.activationKey);
        triggerAlert("OTP sent to your email. Verify your account!");
        navigate("/otp-verification");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card signup-card p-4">
        <h2 className="text-center mb-3">Sign Up</h2>
        {message && <p className="alert alert-danger">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Phone number"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              placeholder="Enter Password"
              onChange={handleChange}
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: "45px",
                right: "10px",
                cursor: "pointer",
                color: "#6c757d",
              }}
            >
              {showPassword ? <VscEyeClosed /> : <VscEye />}
            </div>
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
            <div
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                top: "45px",
                right: "10px",
                cursor: "pointer",
                color: "#6c757d",
              }}
            >
              {showConfirmPassword ? <VscEyeClosed /> : <VscEye />}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 mt-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center mt-3">
            <span className="text-muted">or</span>
          </div>

          <button
            type="button"
            className="btn btn-outline-dark w-100 mt-3 d-flex align-items-center justify-content-center"
            onClick={() =>
              (window.location.href = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/user/auth/google`)
            }
          >
            <svg width="18" height="18" className="me-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <Link to="/login">SignIn</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
