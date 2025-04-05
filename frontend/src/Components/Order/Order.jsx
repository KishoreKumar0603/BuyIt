import React from "react";

export const Order = () => {
  const orders = [
    {
      id: 1,
      title: "Oppo F11 16GB RAM | 128GB ROM | 5.67 inch | 5000mAh Battery",
      brand: "Oppo",
      description:
        "Description about the product fkfhjdkshjkjkgfjhfdhkjhkjfdsjkhgkjjf...",
      price: 999,
      status: "Delivered",
      statusColor: "success",
    },
    {
      id: 2,
      title: "Oppo F11 16GB RAM | 128GB ROM | 5.67 inch | 5000mAh Battery",
      brand: "Oppo",
      description:
        "Description about the product fkfhjdkshjkjkgfjhfdhkjhkjfdsjkhgkjjf...",
      price: 999,
      status: "Pending",
      statusColor: "warning",
    },
    {
      id: 3,
      title: "Oppo F11 16GB RAM | 128GB ROM | 5.67 inch | 5000mAh Battery",
      brand: "Oppo",
      description:
        "Description about the product fkfhjdkshjkjkgfjhfdhkjhkjfdsjkhgkjjf...",
      price: 999,
      status: "Cancelled",
      statusColor: "danger",
    },
  ];

  return (
    <div className="container mt-3">
      {orders.map((order) => (
        <div key={order.id} className="card mb-3 p-3 shadow-sm">
          <div className="d-flex align-items-center">
            {/* Placeholder for product image */}
            <div
              className="bg-secondary rounded"
              style={{ width: "80px", height: "80px" }}
            ></div>

            <div className="ms-3 flex-grow-1">
              <h5 className="fw-bold">{order.title}</h5>
              <p className="text-muted mb-1">Brand: {order.brand}</p>
              <p className="small text-secondary">{order.description}</p>
            </div>

            {/* Order status & price */}
            <div className="text-end">
              <p className={`fw-bold text-${order.statusColor} mb-1`}>
                <span
                  className={`badge bg-${order.statusColor} me-1`}
                  style={{ width: "10px", height: "10px", borderRadius: "50%" }}
                ></span>
                {order.status}
              </p>
              <p className="fs-5 fw-bold">${order.price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
