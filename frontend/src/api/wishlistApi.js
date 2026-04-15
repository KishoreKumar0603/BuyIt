import axiosInstance from "../context/axiosInstance";

// Wishlist APIs
export const getWishlist = async () => {
  const response = await axiosInstance.get("/api/wishlist/my-wishlist");
  return response.data;
};

export const addToWishlist = async (productId, category) => {
  const response = await axiosInstance.post("/api/wishlist/add", {
    productId,
    category,
  });
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await axiosInstance.post("/api/wishlist/remove", {
    productId,
  });
  return response.data;
};
