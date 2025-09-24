// src/services/api.js - Improved version with proper error handling
import axios from 'axios'
import { API_ENDPOINTS, QUERY_KEYS } from '@/constants'

// Base URL configuration
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Custom error class for better error handling
export class ApiError extends Error {
  constructor(error) {
    super(error.message || 'An API error occurred')
    this.name = 'ApiError'
    this.status = error.response?.status
    this.data = error.response?.data
    this.originalError = error
  }
}

// Response interceptor for consistent error handling
const handleApiError = (error) => {
  if (error.response?.status === 401) {
    // Handle unauthorized - clear auth data and redirect
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    window.location.href = '/login'
    return Promise.reject(new ApiError(error))
  }

  if (error.response?.status >= 500) {
    // Server errors
    console.error('Server error:', error)
  }

  return Promise.reject(new ApiError(error))
}

// Auth instance (no token required)
export const authApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

authApi.interceptors.response.use(
  (response) => response,
  handleApiError
)

// Protected API instance
export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(new ApiError(error))
)

// Response interceptor for protected routes
api.interceptors.response.use(
  (response) => response,
  handleApiError
)

// Base service class for consistent API interactions
class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint
  }

  async getAll(params = {}) {
    try {
      const response = await api.get(this.endpoint, { params })
      return {
        data: response.data,
        meta: response.data.meta || null
      }
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`${this.endpoint}/${id}`)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async create(data) {
    try {
      const response = await api.post(this.endpoint, data)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`${this.endpoint}/${id}`, data)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`${this.endpoint}/${id}`)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }
}

// Auth Service with specific methods
class AuthService {
  async login(credentials) {
    try {
      const response = await authApi.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async register(userData) {
    try {
      const response = await authApi.post(API_ENDPOINTS.AUTH.REGISTER, userData)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async logout() {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async getProfile() {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.PROFILE)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async updateProfile(data) {
    try {
      const response = await api.put(API_ENDPOINTS.AUTH.PROFILE, data)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async changePassword(data) {
    try {
      const response = await api.put('/auth/change-password', data)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async forgotPassword(email) {
    try {
      const response = await authApi.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async resetPassword(data) {
    try {
      const response = await authApi.post('/auth/reset-password', data)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }
}

// Programs Service with additional methods
class ProgramsService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.PROGRAMS)
  }

  async getActive() {
    try {
      const response = await api.get(`${this.endpoint}?status=active`)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async updateStatus(id, status) {
    try {
      const response = await api.patch(`${this.endpoint}/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async getStudents(programId) {
    try {
      const response = await api.get(`${this.endpoint}/${programId}/students`)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }
}

// Students Service
class StudentsService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.STUDENTS)
  }

  async getByGuardian(guardianId) {
    try {
      const response = await api.get(`${this.endpoint}?guardian_id=${guardianId}`)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async enrollInProgram(studentId, programId) {
    try {
      const response = await api.post(`${this.endpoint}/${studentId}/enroll`, { program_id: programId })
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async getEnrollments(studentId) {
    try {
      const response = await api.get(`${this.endpoint}/${studentId}/enrollments`)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }
}

// Teachers Service
class TeachersService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.TEACHERS)
  }

  async getBySubject(subject) {
    try {
      const response = await api.get(`${this.endpoint}?subject=${encodeURIComponent(subject)}`)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async getSchedule(teacherId) {
    try {
      const response = await api.get(`${this.endpoint}/${teacherId}/schedule`)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }
}

// Guardians Service
class GuardiansService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.GUARDIANS)
  }

  async getStudents(guardianId) {
    try {
      const response = await api.get(`${this.endpoint}/${guardianId}/students`)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }
}

// Registrations Service
class RegistrationsService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.REGISTRATIONS)
  }

  async updateStatus(id, status) {
    try {
      const response = await api.patch(`${this.endpoint}/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async getPending() {
    try {
      const response = await api.get(`${this.endpoint}?status=pending`)
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }

  async approve(id) {
    return this.updateStatus(id, 'approved')
  }

  async reject(id, reason = '') {
    try {
      const response = await api.patch(`${this.endpoint}/${id}/status`, {
        status: 'rejected',
        reason
      })
      return response.data
    } catch (error) {
      throw new ApiError(error)
    }
  }
}

// Export service instances
export const authService = new AuthService()
export const programsService = new ProgramsService()
export const studentsService = new StudentsService()
export const teachersService = new TeachersService()
export const guardiansService = new GuardiansService()
export const registrationsService = new RegistrationsService()

// Export for legacy compatibility
export {
  authService as authApi,
  programsService,
  studentsService,
  teachersService,
  guardiansService,
  registrationsService
}

export default api