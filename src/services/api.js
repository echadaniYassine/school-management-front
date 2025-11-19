// src/services/api.js
import axios from 'axios'
import { API_ENDPOINTS } from '@/constants'

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
  // Handle 401 Unauthorized - redirect to login
  if (error.response?.status === 401) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    window.location.href = '/login'
    return Promise.reject(new ApiError(error))
  }

  // Handle 403 Forbidden
  if (error.response?.status === 403) {
    console.error('Access forbidden:', error)
  }

  // Handle 500+ Server errors
  if (error.response?.status >= 500) {
    console.error('Server error:', error)
  }

  return Promise.reject(new ApiError(error))
}

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
  (error) => Promise.reject(new ApiError(error))
)
api.interceptors.response.use((r) => r, handleApiError)

//
// ==================== SERVICES ====================
//

// 🔹 Auth Service
export const AuthService = {
  login: async (data) => (await authApi.post(API_ENDPOINTS.AUTH.LOGIN, data)).data,
  register: async (data) => (await authApi.post(API_ENDPOINTS.AUTH.REGISTER, data)).data,
  logout: async () => (await api.post(API_ENDPOINTS.AUTH.LOGOUT)).data,
  profile: async () => (await api.get(API_ENDPOINTS.AUTH.PROFILE)).data,
  changePassword: async (data) => (await api.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data)).data,
  forgotPassword: async (data) => (await authApi.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data)).data,
  resetPassword: async (data) => (await authApi.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)).data,

  // Email verification
  verifyEmail: async (id, hash) => (await api.get(`/email/verify/${id}/${hash}`)).data,
  resendVerification: async () => (await api.post('/email/resend')).data,
}

// 🔹 Programs Service
export const ProgramsService = {
  // Public endpoint - can be accessed without auth
  getAll: async (params = {}) => (await authApi.get(API_ENDPOINTS.PROGRAMS, { params })).data,

  // Protected endpoints
  getById: async (id) => (await api.get(`${API_ENDPOINTS.PROGRAMS}/${id}`)).data,
  create: async (data) => (await api.post(API_ENDPOINTS.PROGRAMS, data)).data,
  update: async (id, data) => (await api.put(`${API_ENDPOINTS.PROGRAMS}/${id}`, data)).data,
  delete: async (id) => (await api.delete(`${API_ENDPOINTS.PROGRAMS}/${id}`)).data,

  // Additional methods
  getActive: async () => (await authApi.get(`${API_ENDPOINTS.PROGRAMS}?status=active`)).data,
  updateStatus: async (id, status) =>
    (await api.patch(`${API_ENDPOINTS.PROGRAMS}/${id}/status`, { status })).data,
  getStudents: async (programId) =>
    (await api.get(`${API_ENDPOINTS.PROGRAMS}/${programId}/students`)).data,
}

// 🔹 Students Service
export const StudentsService = {
  getAll: async (params = {}) => (await api.get(API_ENDPOINTS.STUDENTS, { params })).data,
  getById: async (id) => (await api.get(`${API_ENDPOINTS.STUDENTS}/${id}`)).data,
  create: async (data) => (await api.post(API_ENDPOINTS.STUDENTS, data)).data,
  update: async (id, data) => (await api.put(`${API_ENDPOINTS.STUDENTS}/${id}`, data)).data,
  delete: async (id) => (await api.delete(`${API_ENDPOINTS.STUDENTS}/${id}`)).data,

  // Additional methods
  getByGuardian: async (guardianId) =>
    (await api.get(`${API_ENDPOINTS.STUDENTS}?guardian_id=${guardianId}`)).data,
  enrollInProgram: async (studentId, programId) =>
    (await api.post(`${API_ENDPOINTS.STUDENTS}/${studentId}/enroll`, { program_id: programId })).data,
  getEnrollments: async (studentId) =>
    (await api.get(`${API_ENDPOINTS.STUDENTS}/${studentId}/enrollments`)).data,
}

// 🔹 Teachers Service
export const TeachersService = {
  getAll: async (params = {}) => (await api.get(API_ENDPOINTS.TEACHERS, { params })).data,
  getById: async (id) => (await api.get(`${API_ENDPOINTS.TEACHERS}/${id}`)).data,
  create: async (data) => (await api.post(API_ENDPOINTS.TEACHERS, data)).data,
  update: async (id, data) => (await api.put(`${API_ENDPOINTS.TEACHERS}/${id}`, data)).data,
  delete: async (id) => (await api.delete(`${API_ENDPOINTS.TEACHERS}/${id}`)).data,

  // Additional methods
  getBySubject: async (subject) =>
    (await api.get(`${API_ENDPOINTS.TEACHERS}?subject=${encodeURIComponent(subject)}`)).data,
  getSchedule: async (teacherId) =>
    (await api.get(`${API_ENDPOINTS.TEACHERS}/${teacherId}/schedule`)).data,
}

// 🔹 Guardians Service
export const GuardiansService = {
  getAll: async (params = {}) => (await api.get(API_ENDPOINTS.GUARDIANS, { params })).data,
  getById: async (id) => (await api.get(`${API_ENDPOINTS.GUARDIANS}/${id}`)).data,
  create: async (data) => (await api.post(API_ENDPOINTS.GUARDIANS, data)).data,
  update: async (id, data) => (await api.put(`${API_ENDPOINTS.GUARDIANS}/${id}`, data)).data,
  delete: async (id) => (await api.delete(`${API_ENDPOINTS.GUARDIANS}/${id}`)).data,

  // Additional methods
  getStudents: async (guardianId) =>
    (await api.get(`${API_ENDPOINTS.GUARDIANS}/${guardianId}/students`)).data,
}

// 🔹 Registrations Service
export const RegistrationsService = {
  // Public endpoint - can be accessed without auth
  create: async (data) => (await authApi.post(API_ENDPOINTS.REGISTRATIONS, data)).data,

  // Protected endpoints
  getAll: async (params = {}) => (await api.get(API_ENDPOINTS.REGISTRATIONS, { params })).data,
  getById: async (id) => (await api.get(`${API_ENDPOINTS.REGISTRATIONS}/${id}`)).data,
  update: async (id, data) => (await api.put(`${API_ENDPOINTS.REGISTRATIONS}/${id}`, data)).data,
  delete: async (id) => (await api.delete(`${API_ENDPOINTS.REGISTRATIONS}/${id}`)).data,

  // Additional methods
  updateStatus: async (id, status) =>
    (await api.patch(`${API_ENDPOINTS.REGISTRATIONS}/${id}/status`, { status })).data,
  getPending: async () => (await api.get(`${API_ENDPOINTS.REGISTRATIONS}?status=pending`)).data,
  approve: async (id) => RegistrationsService.updateStatus(id, 'approved'),
  reject: async (id, reason = '') =>
    (await api.patch(`${API_ENDPOINTS.REGISTRATIONS}/${id}/status`, {
      status: 'rejected',
      reason
    })).data,
}

// 🔹 Subjects Service
export const SubjectsService = {
  getAll: async (params = {}) => (await api.get(API_ENDPOINTS.SUBJECTS, { params })).data,
  getById: async (id) => (await api.get(`${API_ENDPOINTS.SUBJECTS}/${id}`)).data,
  create: async (data) => (await api.post(API_ENDPOINTS.SUBJECTS, data)).data,
  update: async (id, data) => (await api.put(`${API_ENDPOINTS.SUBJECTS}/${id}`, data)).data,
  delete: async (id) => (await api.delete(`${API_ENDPOINTS.SUBJECTS}/${id}`)).data,
}

// 🔹 Timetable/Schedule Service (FIXED - This was missing!)
export const TimetableService = {
  // Get timetables for a specific program
  forProgram: async (programId, params = {}) =>
    (await api.get(`/programs/${programId}/timetables`, { params })).data,

  // Get weekly schedule for a program
  getWeeklySchedule: async (programId, params = {}) =>
    (await api.get(`/programs/${programId}/schedule`, { params })).data,

  // Create new timetable entry
  create: async (data) => (await api.post('/timetables', data)).data,

  // Update timetable entry
  update: async (id, data) => (await api.put(`/timetables/${id}`, data)).data,

  // Delete timetable entry
  delete: async (id) => (await api.delete(`/timetables/${id}`)).data,

  // Bulk operations
  bulkUpdate: async (programId, data) =>
    (await api.post(`/programs/${programId}/timetables/bulk`, data)).data,

  // Clear all schedules for a program
  clearSchedule: async (programId) =>
    (await api.delete(`/programs/${programId}/timetables/clear`)).data,
}

//
// ==================== EXPORT ALIASES ====================
// Export both PascalCase and camelCase versions for flexibility
//

export const authService = AuthService
export const programsService = ProgramsService
export const studentsService = StudentsService
export const teachersService = TeachersService
export const guardiansService = GuardiansService
export const registrationsService = RegistrationsService
export const subjectsService = SubjectsService
export const timetableService = TimetableService

// Additional aliases for common naming conventions
export const scheduleService = TimetableService
export const studentService = StudentsService
export const teacherService = TeachersService
export const guardianService = GuardiansService
export const registrationService = RegistrationsService
export const subjectService = SubjectsService
export const programService = ProgramsService

// Export default api instance for custom requests
export default api