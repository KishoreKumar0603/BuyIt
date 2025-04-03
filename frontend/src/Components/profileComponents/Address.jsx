import { useState } from "react";

export const Address = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Arnesh",
      phone: "9043479026",
      address:
        "Uthupalayam, Kpr institute of engineering and technology, Arasur, Tamil Nadu - 625535",
    },
    {
      id: 2,
      name: "Arnesh",
      phone: "9043479026",
      address:
        "Uthupalayam, Kpr institute of engineering and technology, Arasur, Tamil Nadu - 625535",
    },
  ]);

  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editedAddress, setEditedAddress] = useState({ name: "", phone: "", address: "" });

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setEditedAddress({ ...address });
    setEditMode(true);
    setAddMode(false);
  };

  const handleInputChange = (e) => {
    setEditedAddress({ ...editedAddress, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editMode) {
      setAddresses(
        addresses.map((addr) => (addr.id === editedAddress.id ? editedAddress : addr))
      );
      setEditMode(false);
    } else if (addMode) {
      setAddresses([...addresses, { ...editedAddress, id: Date.now() }]);
      setAddMode(false);
    }
  };

  const handleRemove = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
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
  <span className="fs-5 me-2" style={{ fontSize: "20px" }}>➕</span>
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
              />
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-dark me-2" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-outline-dark" onClick={() => { setEditMode(false); setAddMode(false); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="border p-3 rounded mb-3 d-flex justify-content-between align-items-center">
            <div>
              <h6 className="fw-bold mb-1">
                {addr.name} <span className="text-muted">{addr.phone}</span>
              </h6>
              <p className="text-muted mb-0">{addr.address}</p>
            </div>

            <div className="dropdown">
              <button className="btn" data-bs-toggle="dropdown">⋮</button>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={() => handleEdit(addr)}>
                    Edit
                  </button>
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={() => handleRemove(addr.id)}>
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
