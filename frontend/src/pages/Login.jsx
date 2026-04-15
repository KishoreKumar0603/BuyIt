import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/pages/Login.css";
import { loginUser } from "../api/userApi";
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { triggerAlert } = useAlert();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);

      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        triggerAlert(data.message);
        navigate("/");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
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
              disabled={loading}
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
              disabled={loading}
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
                Signing In...
              </>
            ) : (
              "SignIn"
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
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
