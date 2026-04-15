import axiosInstance from "../context/axiosInstance";

// Product APIs
export const getProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axiosInstance.get(`/api/products?${queryString}`);
  return response.data;
};

export const getProductById = async (category, id) => {
  const response = await axiosInstance.get(`/api/products/${category}/${id}`);
  return response.data;
};

export const addProduct = async (productData) => {
  const response = await axiosInstance.post("/api/products", productData);
  return response.data;
};

export const updateProduct = async (id, updates) => {
  const response = await axiosInstance.put(`/api/products/${id}`, updates);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/api/products/${id}`);
  return response.data;
};

export const addProductReview = async (category, id, rating, comment) => {
  const response = await axiosInstance.post(
    `/api/products/${category}/${id}/review`,
    { rating, comment },
  );
  return response.data;
};

// Category APIs
export const getCategories = async () => {
  const response = await axiosInstance.get("/api/products/category");
  return response.data;
};
