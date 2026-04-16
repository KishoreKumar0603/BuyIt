import axiosInstance from "../context/axiosInstance";

export const placeOrder = async (products) => {
  const response = await axiosInstance.post("/api/orders/place", { products });
  return response.data;
};

export const getUserOrders = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axiosInstance.get(
    `/api/orders/my-orders?${queryString}`,
  );
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await axiosInstance.delete(`/api/orders/${orderId}`);
  return response.data;
};

export const getAllOrders = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axiosInstance.get(
    `/api/orders/all-orders?${queryString}`,
  );
  return response.data;
};

export const updateOrderStatus = async (orderId, orderStatus) => {
  const response = await axiosInstance.put(
    `/api/orders/update-status/${orderId}`,
    { orderStatus },
  );
  return response.data;
};
