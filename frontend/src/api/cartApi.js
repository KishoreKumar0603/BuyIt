import axiosInstance from "../context/axiosInstance";

export const getCart = async () => {
  const response = await axiosInstance.get("/api/cart");
  return response.data;
};

export const addToCart = async (productId, category, quantity = 1) => {
  const response = await axiosInstance.post("/api/cart/add", {
    productId,
    category,
    quantity,
  });
  return response.data;
};

export const updateCartItem = async (productId, quantity) => {
  const response = await axiosInstance.put("/api/cart/update", {
    productId,
    quantity,
  });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await axiosInstance.delete(`/api/cart/remove/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await axiosInstance.delete("/api/cart/clear");
  return response.data;
};
