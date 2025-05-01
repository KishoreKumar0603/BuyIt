import React, { useEffect, useState } from "react";
import axiosInstance from "../../context/axiosInstance.js";

export const Order = () => {
  useEffect(() => {
    document.title = `BuyIt | Orders`;
  }, []);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/api/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "success";
      case "processing":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Show spinner while loading
  if (loading) {
    return (
      <div className="container mt-4 d-flex justify-content-center" style={{ height: "300px" }}>
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Show message if no orders are found
  if (orders.length === 0) {
    return <div className="container mt-4">No orders found.</div>;
  }

  return (
    <div className="container mt-4">
      {orders.map((order) =>
        order.products.map((item, index) => (
          <div
            key={item.productId + "-" + index}
            className="box mb-3 p-3"
            style={{
              border: "none",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div className="bg-light">
                <img
                  src={item.image_url}
                  alt=""
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                />
              </div>
              <div className="flex-grow-1 px-3">
                <h6 className="fw-semibold mb-1">{item.title}</h6>
                <p
                  className="secondary mb-0"
                  style={{ fontSize: "13px", lineHeight: "1.4" }}
                >
                  Quantity: {item.quantity}
                </p>
                <p className="secondary" style={{ fontSize: "13px" }}>
                  Category: {item.category}
                </p>
              </div>
              <div className="text-end">
                <p className="mb-2" style={{ fontSize: "14px" }}>
                  <span
                    className={`me-1 d-inline-block bg-${getStatusColor(
                      order.orderStatus
                    )}`}
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      verticalAlign: "middle",
                    }}
                  ></span>
                  <span className={`text-dark`}>{order.orderStatus}</span>
                </p>
                <h5 className="fw-bold mt-2">₹{item.price}</h5>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
