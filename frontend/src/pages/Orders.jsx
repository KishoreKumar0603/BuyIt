import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { getUserOrders } from "../../api/orderApi";
import "../../assets/css/pages/Orders.css";

export const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });

  useEffect(() => {
    if (user) {
      fetchOrders(1);
    }
  }, [user]);

  const fetchOrders = async (page = 1) => {
    try {
      const response = await getUserOrders({ page, limit: pagination.limit });
      if (response.orders) {
        setOrders(response.orders);
        setPagination(response.pagination);
      } else {
        setOrders(response);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalOrders: response.length,
          hasNextPage: false,
          hasPrevPage: false,
          limit: 10,
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      fetchOrders(pageNumber);
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
      <h2 className="mb-4">My Orders</h2>

      <div className="mb-3">
        <small className="text-muted">
          Showing {orders.length} of {pagination.totalOrders} orders
        </small>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="fas fa-shopping-bag fa-3x text-muted"></i>
          </div>
          <h4 className="text-muted">No orders yet</h4>
          <p className="text-muted">Your order history will appear here</p>
        </div>
      ) : (
        <>
          <div className="row">
            {orders.map((order) => (
              <div key={order._id} className="col-12 mb-4">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Order #{order._id.slice(-8)}</h6>
                      <small className="text-muted">
                        Ordered on {formatDate(order.createdAt)}
                      </small>
                    </div>
                    <span
                      className={`badge bg-${getStatusColor(order.orderStatus || order.status)}`}
                    >
                      {order.orderStatus || order.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {(order.products || order.items).map((item, index) => (
                        <div key={index} className="col-md-6 mb-3">
                          <div className="d-flex align-items-center">
                            <img
                              src={
                                item.product?.image_url || "/placeholder.jpg"
                              }
                              alt={item.product?.title}
                              className="rounded me-3"
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "contain",
                              }}
                            />
                            <div>
                              <h6 className="mb-1">{item.product?.title}</h6>
                              <p className="mb-1 text-muted">
                                Qty: {item.quantity}
                              </p>
                              <p className="mb-0 fw-bold">₹{item.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Total: ₹{order.totalAmount}</strong>
                      </div>
                      <div className="text-end">
                        <small className="text-muted d-block">
                          Payment: {order.paymentMethod || "Cash on Delivery"}
                        </small>
                        {order.deliveryAddress && (
                          <small className="text-muted d-block">
                            Delivered to: {order.deliveryAddress.street},{" "}
                            {order.deliveryAddress.city}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li
                    className={`page-item ${!pagination.hasPrevPage ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link text-dark"
                      onClick={() => paginate(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <li
                      key={page}
                      className={`page-item ${pagination.currentPage === page ? "active" : ""}`}
                    >
                      <button
                        className="page-link text-dark"
                        onClick={() => paginate(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${!pagination.hasNextPage ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link text-dark"
                      onClick={() => paginate(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};
