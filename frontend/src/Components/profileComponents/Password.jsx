import React from "react";

export const Password = () => {
  return (
    <div className="container box vh-50">
      <div className="p-4" style={{ width: "300px" }}>
        <label className="">Old Password</label>
        <input type="password" className="form-control mb-3" />

        <label className="">New Password</label>
        <input type="password" className="form-control mb-3" />

        <label className="">Confirm Password</label>
        <input type="password" className="form-control mb-3" />

        <button className="btn btn-dark w-100">Save</button>
      </div>
    </div>
  );
};
