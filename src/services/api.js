import axiosInstance from "./axios";

// Auth
export const loginUser = (data) => axiosInstance.post('/auth/login', data)

// Properties
export const addProperty = (data) => axiosInstance.post('/properties/add', data)