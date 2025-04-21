import { useEffect, useState } from "react";
import axios from "axios";

export const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editedAddress, setEditedAddress] = useState({ name: "", phone: "", address: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/addresses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAddresses(res.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setAddresses([]);
      }
    };

    fetchAddresses();
  }, []);

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setEditedAddress({ ...address });
    setEditMode(true);
    setAddMode(false);
  };

  const handleInputChange = (e) => {
    setEditedAddress({ ...editedAddress, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // ✅ Validation
    if (
      !editedAddress.name.trim() ||
      !editedAddress.phone.trim() ||
      !editedAddress.address.trim()
    ) {
      alert("Please fill in all fields before saving.");
      return;
    }

    try {
      if (editMode) {
        const res = await axios.put(
          `http://localhost:5000/api/addresses/${editedAddress._id}`,
          editedAddress,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAddresses((prev) =>
          prev.map((addr) => (addr._id === res.data._id ? res.data : addr))
        );
        setEditMode(false);
      } else if (addMode) {
        const res = await axios.post(
          "http://localhost:5000/api/addresses",
          editedAddress,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAddresses((prev) => [...prev, res.data]);
        setAddMode(false);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/addresses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddresses((prev) => prev.filter((addr) => addr._id !== id));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className="container p-5 vh-50 box">
      <h3 className="fw-bold">Manage Addresses</h3>

      <button
        className="border bg-white text-muted d-flex align-items-center px-3 py-2 mt-3 rounded"
        style={{
          border: "1px solid #ccc",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
        onClick={() => {
          setAddMode(true);
          setEditMode(false);
          setEditedAddress({ name: "", phone: "", address: "" });
        }}
      >
        <span className="fs-5 me-2">➕</span>
        <span>Add New Address</span>
      </button>

      {(editMode || addMode) && (
        <div className="border p-4 mt-4 rounded">
          <h5 className="fw-bold">{editMode ? "Edit Address" : "Add Address"}</h5>
          <div className="row g-3 mt-2">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={editedAddress.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={editedAddress.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={editedAddress.address}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-dark me-2" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn btn-outline-dark"
              onClick={() => {
                setEditMode(false);
                setAddMode(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-4">
        {Array.isArray(addresses) &&
          addresses.map((addr) => (
            <div
              key={addr._id}
              className="border p-3 rounded mb-3 d-flex justify-content-between align-items-center"
            >
              <div>
                <h6 className=" mb-1">
                  {addr.name} <span className="text-muted">{addr.phone}</span>
                </h6>
                <p className="text-muted mb-0">{addr.address}</p>
              </div>

              <div className="dropdown">
                <button className="btn" data-bs-toggle="dropdown">
                  ⋮
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleEdit(addr)}
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => handleRemove(addr._id)}
                    >
                      Remove
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Address;
