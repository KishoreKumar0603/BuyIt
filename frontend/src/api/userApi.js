import axiosInstance from "../context/axiosInstance";

// User Authentication APIs
export const loginUser = async (email, password) => {
  const response = await axiosInstance.post("/api/user/login", {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (name, email, phone, password) => {
  const response = await axiosInstance.post("/api/user/register", {
    name,
    email,
    phone,
    password,
  });
  return response.data;
};

export const verifyUser = async (otp, activationKey) => {
  const response = await axiosInstance.post("/api/user/verify", {
    otp,
    activationKey,
  });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await axiosInstance.post("/api/user/refresh", {
    refreshToken,
  });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await axiosInstance.get("/api/user/my-profile");
  return response.data;
};

export const updateUserProfile = async (updates) => {
  const response = await axiosInstance.patch("/api/user/update", updates);
  return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await axiosInstance.put("/api/user/change-password", {
    oldPassword,
    newPassword,
  });
  return response.data;
};

export const deleteUser = async () => {
  const response = await axiosInstance.delete("/api/user/delete");
  return response.data;
};

// Forgot Password APIs
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post(
    "/api/user/forgot/forgot-password",
    { email },
  );
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await axiosInstance.post("/api/user/forgot/verify-otp", {
    email,
    otp,
  });
  return response.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await axiosInstance.post("/api/user/forgot/reset-password", {
    email,
    otp,
    newPassword,
  });
  return response.data;
};

// Google OAuth APIs
export const completeProfile = async (profileData) => {
  const response = await axiosInstance.post(
    "/api/user/complete-profile",
    profileData,
  );
  return response.data;
};
