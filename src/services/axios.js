import axios from 'axios'

// Create axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://127.0.0.1:8000',
    timeout: 8000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem('auth_token')
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor
axiosInstance.interceptors.request.use(
    (response) => response,
    (error) => {
        // Handle 401, 403 error status
        if (error.response) {
            const { status } = error.response
            if (status === 401 || status === 403) {
                alert('Unauthorized, You are not allowed for this action.')
                localStorage.removeItem('auth_token')
            }
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
