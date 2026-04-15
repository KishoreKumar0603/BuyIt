import axiosInstance from "../context/axiosInstance";

// Admin APIs
export const getAdminStats = async () => {
  const response = await axiosInstance.get("/api/admin/stats");
  return response.data;
};
