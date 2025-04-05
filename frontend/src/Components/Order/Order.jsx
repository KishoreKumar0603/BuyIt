import React from "react";

export const Order = () => {
  const orders = [
    {
      id: 1,
      title: "Oppo F11 16ram | 128 Rom | 5.67 inc | 5000mAH Battery",
      brand: "Oppo",
      description:
        "Description about the product kfkhjdkshjkjkgfjhfdhkjhkjfdsjkhhgjjf ddsgjgj5fmchkmmjhsmjkmhgkfh hhsd",
      price: 999,
      status: "Delivered",
      statusColor: "success",
    },
    {
      id: 2,
      title: "Oppo F11 16ram | 128 Rom | 5.67 inc | 5000mAH Battery",
      brand: "Oppo",
      description:
        "Description about the product kfkhjdkshjkjkgfjhfdhkjhkjfdsjkhhgjjf ddsgjgj5fmchkmmjhsmjkmhgkfh hhsd",
      price: 999,
      status: "Pending",
      statusColor: "warning",
    },
    {
      id: 3,
      title: "Oppo F11 16ram | 128 Rom | 5.67 inc | 5000mAH Battery",
      brand: "Oppo",
      description:
        "Description about the product kfkhjdkshjkjkgfjhfdhkjhkjfdsjkhhgjjf ddsgjgj5fmchkmmjhsmjkmhgkfh hhsd",
      price: 999,
      status: "Cancelled",
      statusColor: "danger",
    },
  ];

  return (
    <div className="container mt-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="card mb-3 p-3"
          style={{ border: "none", borderRadius: "6px", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
        >
          <div className="d-flex justify-content-between align-items-start">
            {/* Image */}
            <div
              className="bg-light"
              style={{ width: "100px", height: "100px", borderRadius: "4px" }}
            ></div>

            {/* Info */}
            <div className="flex-grow-1 px-3">
              <h6 className="fw-semibold mb-1">{order.title}</h6>
              <p className="mb-1" style={{ fontSize: "14px" }}>
                <strong>Brand :</strong> {order.brand}
              </p>
              <p className="text-muted mb-0" style={{ fontSize: "13px", lineHeight: "1.4" }}>
                {order.description}
              </p>
            </div>

            {/* Status & Price */}
            <div className="text-end">
              <p className="mb-2" style={{ fontSize: "14px" }}>
                <span
                  className={`me-1 d-inline-block bg-${order.statusColor}`}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    verticalAlign: "middle",
                  }}
                ></span>
                <span className={`text-${order.statusColor}`}>{order.status}</span>
              </p>
              <h5 className="fw-bold mt-2">${order.price}</h5>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
