import axios from 'axios'
import router from '@/router'
import { toastNotifications } from '@/composables/toastNotifications'

const { showToast } = toastNotifications()

// Create axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000',
    timeout: 8000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem('token')
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            showToast('error', 'Network problem. Please check your internet connection.')
            return Promise.reject(error)
        }

        const { status, data } = error.response

        switch (status) {
            case 400:
                showToast('error', 'Oops! Bad request.')
                break

            case 401:
                showToast('error', 'Oops! You are not authenticated. Try to login.')
                router.push({ name: 'realtor.login' })
                break

            case 403:
                showToast('error', 'Unauthorized! You are not allowed for this action.')
                break

            case 404:
                showToast('error', 'Resource not found.')
                break

            case 422:
                if (data?.errors) {
                    Object.values(data.errors).forEach((messages) => {
                        messages.forEach((msg) => showToast('error', msg))
                    })
                } else {
                    showToast('error', data?.message || 'Oops! Something went wrong.')
                }
                break
            
            case 429:
                // Handle on pages for now
                break

            case 500:
            case 501:
            case 502:
            case 503:
            case 504:
                showToast('error', 'Server error. Please try again later or Contact support.')
                break

            default:
                showToast('error', data.message || 'Oops! Something went wrong.')
        }
        
        return Promise.reject(error)
    }
)

export default axiosInstance
