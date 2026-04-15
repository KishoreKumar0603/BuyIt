import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getAllOrders, updateOrderStatus } from "../api/orderApi";
import "../assets/css/pages/AdminOrders.css";

export const AdminOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated successfully");
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status.toLowerCase() === filterStatus);

  if (!user || user.role !== "admin") {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Panel - Order Management</h2>
        <div className="d-flex align-items-center">
          <label className="me-2">Filter by Status:</label>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: "150px" }}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5>Orders ({filteredOrders.length})</h5>
        </div>
        <div className="card-body">
          {filteredOrders.length === 0 ? (
            <p className="text-muted">No orders found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <small>#{order._id.slice(-8)}</small>
                      </td>
                      <td>
                        <div>
                          <div>{order.user?.name || "N/A"}</div>
                          <small className="text-muted">
                            {order.user?.email}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          {order.items?.slice(0, 2).map((item, index) => (
                            <div key={index}>
                              <small>
                                {item.product?.title} (x{item.quantity})
                              </small>
                            </div>
                          ))}
                          {order.items?.length > 2 && (
                            <small className="text-muted">
                              +{order.items.length - 2} more items
                            </small>
                          )}
                        </div>
                      </td>
                      <td>₹{order.totalAmount}</td>
                      <td>
                        <span
                          className={`badge bg-${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <small>{formatDate(order.createdAt)}</small>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order._id, e.target.value)
                          }
                          style={{ width: "120px" }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
