import React, { useState } from "react";
import axios from "axios";

export const Password = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { oldPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      return setMessage("New and confirm passwords do not match");
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong while updating"
      );
    }
  };

  return (
    <div className="container box vh-50">
      <div className="p-4" style={{ width: "300px" }}>
        <label>Old Password</label>
        <input
          type="password"
          className="form-control mb-3"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
        />

        <label>New Password</label>
        <input
          type="password"
          className="form-control mb-3"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          className="form-control mb-3"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button className="btn btn-dark w-100" onClick={handleSave}>
          Save
        </button>

        {message && <p className="mt-3 text-center text-danger">{message}</p>}
      </div>
    </div>
  );
};
