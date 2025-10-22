import axiosInstance from "./axios";

// Auth
export const loginUser = (data) => axiosInstance.post('/auth/login', data)
export const registerUser = (data) => axiosInstance.post('/auth/register', data)
export const logoutUser = () => axiosInstance.delete('/auth/logout')

// Verifications
export const verifyOtp = (data) => axiosInstance.post('/otp/verify', data)

// Properties
export const addProperty = (data) => axiosInstance.post('/properties/add', data)