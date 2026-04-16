import axiosInstance from "../context/axiosInstance";

export const getAdminStats = async () => {
  const response = await axiosInstance.get("/api/admin/stats");
  return response.data;
};
