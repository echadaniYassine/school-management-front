import { authApi, api } from '../client'
import { API_ENDPOINTS } from '@/constants'

export const programsService = {
  getAll: async (params = {}) => (await authApi.get(API_ENDPOINTS.PROGRAMS, { params })).data,
  getById: async (id) => (await api.get(`${API_ENDPOINTS.PROGRAMS}/${id}`)).data,
  create: async (data) => (await api.post(API_ENDPOINTS.PROGRAMS, data)).data,
  update: async (id, data) => (await api.put(`${API_ENDPOINTS.PROGRAMS}/${id}`, data)).data,
  delete: async (id) => (await api.delete(`${API_ENDPOINTS.PROGRAMS}/${id}`)).data,
  getActive: async () => (await authApi.get(`${API_ENDPOINTS.PROGRAMS}?status=active`)).data,
  updateStatus: async (id, status) => (await api.patch(`${API_ENDPOINTS.PROGRAMS}/${id}/status`, { status })).data,
  getStudents: async (programId) => (await api.get(`${API_ENDPOINTS.PROGRAMS}/${programId}/students`)).data,
}