import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../context/axiosInstance";
import { useAlert } from "../../context/AlertContext";
export const Personal = () => {
  const {user} = useOutletContext();
  const [isEditing, setIsEditing] = useState({
    name: false,
    username: false,
    email: false,
    mobile: false,
    gender:false,
  });

  const [userData, setUserData] = useState({
    name: user.name,
    gender: user.gender,
    username: user.username,
    email: user.email,
    mobile: user.phone,
  });

  const {triggerAlert} =  useAlert();

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

 const handleSave = async (field) => {
  try {
    const token = localStorage.getItem("token");

    // Sending PATCH request with axios
    const response = await axiosInstance.patch(
      `/api/user/update`, 
      { [field]: userData[field] }, 
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    console.log("response Fetched....");

    if (response.status !== 200) throw new Error("Update failed");

    console.log("User updated:", response.data);

    setIsEditing({ ...isEditing, [field]: false });
  } catch (err) {
    console.error(err);
    // alert("Something went wrong. Try again.");
    triggerAlert("Something went wrong. Try again.");
  }
};
  

  return (
    <div className="container p-4 bg-white box">
      {/* Name */}
      <div className="mb-4">
        <label className="mb-3">
          Name <span className="text-edit" onClick={() => handleEdit("name")} style={{ cursor: "pointer" }}> ✎ edit</span>
        </label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={userData.name}
          onChange={handleChange}
          disabled={!isEditing.name}
        />
        {isEditing.name && <Button onClick={() => handleSave("name")} className="btn-save mt-3">Save</Button>}
      </div>

      {/* Gender */}
      <div className="mb-4">
        <label className="mb-3">
          Gender <span className="text-edit" onClick={() => handleEdit("gender")} style={{ cursor: "pointer" }}> ✎ edit</span>
        </label>
        <div>
          <Form.Check inline label="Male" type="radio" name="gender" value="male" checked={userData.gender === "male"} onChange={handleChange} disabled={!isEditing.gender} />
          <Form.Check inline label="Female" type="radio" name="gender" value="female" checked={userData.gender === "female"} onChange={handleChange} disabled={!isEditing.gender} />
        </div>
        {isEditing.gender && <Button onClick={() => handleSave("gender")} className="btn-save mt-3">Save</Button>}
      </div>

      {/* Username */}
      <div className="mb-4">
        <label className="mb-3">
          Username <span className="text-edit" onClick={() => handleEdit("username")} style={{ cursor: "pointer" }}> ✎ edit</span>
        </label>
        <input
          type="text"
          className="form-control"
          name="username"
          value={userData.username}
          onChange={handleChange}
          disabled={!isEditing.username}
        />
        {isEditing.username && <Button onClick={() => handleSave("username")} className="btn-save mt-3">Save</Button>}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="mb-3">
          Email <span className="text-edit" onClick={() => handleEdit("email")} style={{ cursor: "pointer" }}> ✎ edit</span>
        </label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={userData.email}
          onChange={handleChange}
          disabled={!isEditing.email}
        />
        {isEditing.email && <Button onClick={() => handleSave("email")} className="btn-save mt-3">Save</Button>}
      </div>

      {/* Mobile */}
      <div className="mb-4">
        <label className="mb-3">
          Mobile <span className="text-edit" onClick={() => handleEdit("mobile")} style={{ cursor: "pointer" }}> ✎ edit</span>
        </label>
        <input
          type="text"
          className="form-control"
          name="mobile"
          value={userData.mobile}
          onChange={handleChange}
          disabled={!isEditing.mobile}
        />
        {isEditing.mobile && <Button onClick={() => handleSave("mobile")} className="btn-save mt-3">Save</Button>}
      </div>
      {/* FAQs */}
      <div className="mt-4">
        <h6 className="mb-3">FAQs</h6>
        <p>What happens when I update my email address (or mobile number)?<br />
          <span className="text-edit">Your login email (or mobile number) changes. You'll receive all account-related communication on the updated email or mobile.</span></p>

        <p>When will my BuyIt account be updated?<br />
        <span className="text-edit">As soon as you confirm the verification code sent to your email or mobile.</span>
          </p>

        <p>What happens to my existing account when I update my email?<br />
        <span className="text-edit">Updating your email doesn't invalidate your account. Your order history and saved information remain intact.</span>
          </p>
      </div>

      {/* Deactivate & Delete Account Buttons */}
      <div className="mt-4">
        <Link to='/' className='text-warning text-decoration-none'>Deactivate Account</Link>
        <br />
        <Link to='/' className='text-danger text-decoration-none'>Delete Account</Link>
      </div>
    </div>
  );
};

