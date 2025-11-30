import { api } from '../client'
import { API_ENDPOINTS } from '@/constants'

export const studentsService = {
  getAll: async (params = {}) => (await api.get(API_ENDPOINTS.STUDENTS, { params })).data,
  getById: async (id) => (await api.get(`${API_ENDPOINTS.STUDENTS}/${id}`)).data,
  create: async (data) => (await api.post(API_ENDPOINTS.STUDENTS, data)).data,
  update: async (id, data) => (await api.put(`${API_ENDPOINTS.STUDENTS}/${id}`, data)).data,
  delete: async (id) => (await api.delete(`${API_ENDPOINTS.STUDENTS}/${id}`)).data,
  getByGuardian: async (guardianId) => (await api.get(`${API_ENDPOINTS.STUDENTS}?guardian_id=${guardianId}`)).data,
  enrollInProgram: async (studentId, programId) => (await api.post(`${API_ENDPOINTS.STUDENTS}/${studentId}/enroll`, { program_id: programId })).data,
  getEnrollments: async (studentId) => (await api.get(`${API_ENDPOINTS.STUDENTS}/${studentId}/enrollments`)).data,
}