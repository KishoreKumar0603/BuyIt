import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/pages/Login.css";
import axiosInstance from "../context/axiosInstance";
import { useAlert } from "../context/AlertContext";
import { VscEye, VscEyeClosed } from "react-icons/vsc"; // 👈 Import icons

const Login = () => {
  useEffect(() => {
    document.title = "BuyIt | Login";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 New state
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { triggerAlert } = useAlert();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/api/user/login", {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        triggerAlert(res.data.message);
        navigate("/");
      } else {
        setError(res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card login-card p-4">
        <h2 className="text-center mb-3">SignIn</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-1 position-relative">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="text-start">
            <Link to="/forgot-password" className="small">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-dark w-100 mt-3">
            SignIn
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
