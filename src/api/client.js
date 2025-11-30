import axios from 'axios'
import { handleApiError } from './errors'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Auth instance (no token required)
export const authApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
})

authApi.interceptors.response.use((r) => r, handleApiError)

// Protected API instance
export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
})

// Attach token to protected requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use((r) => r, handleApiError)
