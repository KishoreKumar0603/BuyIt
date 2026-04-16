import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { completeProfile } from "../api/userApi";
import { useAlert } from "../context/AlertContext";
import "../assets/css/pages/CompleteProfile.css";

const CompleteProfile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { triggerAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    gender: "",
    address: {
      street: "",
      city: "",
      zip: "",
      country: "",
    },
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await completeProfile(formData);
      triggerAlert("Profile completed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Complete profile error:", error);
      triggerAlert("Failed to complete profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card complete-profile-card p-4">
        <h2 className="text-center mb-4">Complete Your Profile</h2>
        <p className="text-center text-muted mb-4">
          Please provide additional information to complete your account setup.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Enter your phone number"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className="form-control"
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Street Address</label>
            <input
              type="text"
              name="address.street"
              className="form-control"
              placeholder="Enter street address"
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">City</label>
              <input
                type="text"
                name="address.city"
                className="form-control"
                placeholder="Enter city"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">ZIP Code</label>
              <input
                type="text"
                name="address.zip"
                className="form-control"
                placeholder="Enter ZIP code"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Country</label>
            <input
              type="text"
              name="address.country"
              className="form-control"
              placeholder="Enter country"
              onChange={handleChange}
            />
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
                Completing Profile...
              </>
            ) : (
              "Complete Profile"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <button className="btn btn-link" onClick={() => navigate("/")}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
