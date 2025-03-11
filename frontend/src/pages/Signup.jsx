import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import "../assets/css/pages/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // To redirect after successful signup

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/user/register", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });
  
      setMessage(response.data.message);
  
      if (response.status === 200) {
        // Store activationKey in local storage
        localStorage.setItem("activationKey", response.data.activationKey);
  
        alert("OTP sent to your email. Verify your account!");
        navigate("/otp-verification"); // Redirect to OTP verification page
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
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
            <input type="text" name="name" className="form-control" placeholder="Name" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input type="text" name="phone" className="form-control" placeholder="Phone number" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" placeholder="Enter Password" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-dark w-100 mt-3">Create Account</button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
