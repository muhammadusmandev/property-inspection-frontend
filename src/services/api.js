import axiosInstance from "./axios";

// Auth
export const loginUser = (data) => axiosInstance.post('/auth/login', data)
export const registerUser = (data) => axiosInstance.post('/auth/register', data)
export const logoutUser = () => axiosInstance.delete('/auth/logout')

// Verifications
export const verifyOtp = (data) => axiosInstance.post('/otp/verify', data)
export const resendOtp = (data) => axiosInstance.post('/otp/resend', data)
export const resetPassword = (data) => axiosInstance.post('/forgot-password/reset-password', data)

// Properties
export const addProperty = (data) => axiosInstance.post('/properties', data)
export const updateProperty = (data, id) => axiosInstance.put(`/properties/${id}`, data)
export const getProperty = ({}, id) => axiosInstance.get(`/properties/${id}`)
export const deleteProperty = ({}, id) => axiosInstance.delete(`/properties/${id}`)
export const getProperties = ({}, params) => axiosInstance.get(`/properties/${params}`)

// Clients
export const addClient = (data) => axiosInstance.post('/clients', data)
export const updateClient = (data, id) => axiosInstance.put(`/clients/${id}`, data)
export const getClient = ({}, id) => axiosInstance.get(`/clients/${id}`)
export const deleteClient = ({}, id) => axiosInstance.delete(`/clients/${id}`)
export const getRealtorClients = ({}, params) => axiosInstance.get(`/clients/${params}`)

// Branches
export const addRealtorBranch = (data) => axiosInstance.post('/branches', data)
export const updateBranch = (data, id) => axiosInstance.put(`/branches/${id}`, data)
export const getBranch = ({}, id) => axiosInstance.get(`/branches/${id}`)
export const deleteBranch = ({}, id) => axiosInstance.delete(`/branches/${id}`)
export const getRealtorBranches = ({}, params) => axiosInstance.get(`/branches/${params}`)

// Countries
export const getCountriesList = () => axiosInstance.get('/countries/list')