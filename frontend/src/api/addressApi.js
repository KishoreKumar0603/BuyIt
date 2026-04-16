import axiosInstance from "../context/axiosInstance";

export const getUserAddresses = async () => {
  const response = await axiosInstance.get("/api/addresses");
  return response.data;
};

export const addAddress = async (addressData) => {
  const response = await axiosInstance.post("/api/addresses", addressData);
  return response.data;
};

export const updateAddress = async (addressId, updates) => {
  const response = await axiosInstance.put(
    `/api/addresses/${addressId}`,
    updates,
  );
  return response.data;
};

export const deleteAddress = async (addressId) => {
  const response = await axiosInstance.delete(`/api/addresses/${addressId}`);
  return response.data;
};

export const setDefaultAddress = async (addressId) => {
  const response = await axiosInstance.patch(
    `/api/addresses/${addressId}/default`,
  );
  return response.data;
};
