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
export const getClientProperties = ({}, id) => axiosInstance.get(`/clients/properties/${id}`)
export const associateProperty = (data) => axiosInstance.post('/clients/associate-property', data)

// Branches
export const addRealtorBranch = (data) => axiosInstance.post('/branches', data)
export const updateBranch = (data, id) => axiosInstance.put(`/branches/${id}`, data)
export const getBranch = ({}, id) => axiosInstance.get(`/branches/${id}`)
export const deleteBranch = ({}, id) => axiosInstance.delete(`/branches/${id}`)
export const getRealtorBranches = ({}, params) => axiosInstance.get(`/branches/${params}`)

// Countries
export const getCountriesList = () => axiosInstance.get('/countries/list')

// Inspection Areas
export const getInspectionAreas = ({}, params) => axiosInstance.get(`/inspection-areas/${params}`)
export const getInspectionArea= ({}, id) => axiosInstance.get(`/inspection-areas/${id}`)
export const addInspectionArea = (data) => axiosInstance.post('/inspection-areas', data)
export const updateInspectionArea = (data, id) => axiosInstance.put(`/inspection-areas/${id}`, data)
export const deleteInspectionArea = ({}, id) => axiosInstance.delete(`/inspection-areas/${id}`)

// Inspection Area Items
export const getInspectionAreaItemsList = () => axiosInstance.get(`/inspection-area-items`)

// Templates
export const getTemplates = ({}, params) => axiosInstance.get(`/templates/${params}`)
export const getTemplate = ({}, id) => axiosInstance.get(`/templates/${id}`)
export const addTemplate = (data) => axiosInstance.post('/templates', data)
export const updateTemplate = (data, id) => axiosInstance.put(`/templates/${id}`, data)
export const deleteTemplate = ({}, id) => axiosInstance.delete(`/templates/${id}`)

// Reports
export const getReports = ({}, params) => axiosInstance.get(`/reports/${params}`)
export const getReport = ({}, id) => axiosInstance.get(`/reports/${id}`)
export const addReport = (data) => axiosInstance.post('/reports', data)
export const updateReport = (data, id) => axiosInstance.put(`/reports/${id}`, data)
export const deleteReport = ({}, id) => axiosInstance.delete(`/reports/${id}`)
export const updateChecklistItem = (data) => axiosInstance.put(`/update-report-inspection-checklist`, data)
export const markReportLocked = ({}, id) => axiosInstance.put(`/mark-report-locked/${id}`)

// Report Inspection Areas
export const getReportInspectionArea= ({}, id) => axiosInstance.get(`/report-inspection-areas/${id}`)
export const addReportInspectionArea = (data) => axiosInstance.post('/report-inspection-areas', data)
export const updateReportInspectionArea = (data, id) => axiosInstance.put(`/report-inspection-areas/${id}`, data)
export const deleteReportInspectionArea = ({}, id) => axiosInstance.delete(`/report-inspection-areas/${id}`)
export const uploadReportInspectionAreaImages = (data, {}, config) => axiosInstance.post('report-inspection-areas/upload-images', data, { ...config })

// Report Inspection Area Defects
export const addReportAreaDefect = (data, {}, config) => axiosInstance.post('/report-inspection-area-defects', data, { ...config })

// Billings
export const getShowBillingsList = () => axiosInstance.get('/billings/show-billing-data')
export const activateSubscription = (data) => axiosInstance.post('/billings/activate-subscription', data)

// Subscriptions
export const getSubscriptionData = () => axiosInstance.get('/subscriptions/status')

// Medias
export const deleteMedia = ({}, id) => axiosInstance.delete(`/medias/${id}`)
