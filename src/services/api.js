import axiosInstance from "./axios";

export const loginUser = (data) => axiosInstance.post('/auth/login', data)