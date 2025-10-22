import axiosInstance from "./axios";

// Auth
export const loginUser = (data) => axiosInstance.post('/auth/login', data)
export const registerUser = (data) => axiosInstance.post('/auth/register', data)
export const logoutUser = () => axiosInstance.delete('/auth/logout')

// Verifications
export const verifyOtp = (data) => axiosInstance.post('/otp/verify', data)
export const resendOtp = (data) => axiosInstance.post('/otp/resend', data)

// Properties
export const addProperty = (data) => axiosInstance.post('/properties', data)

// Clients
export const getRealtorClients = () => axiosInstance.get('/clients')

// Braches
export const getRealtorBranches = () => axiosInstance.get('/branches')

// Countries
export const getCountriesList = () => axiosInstance.get('/countries/list')