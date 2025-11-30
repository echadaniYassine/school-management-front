import { api } from '../client'
import { API_ENDPOINTS } from '@/constants'

export const guardiansService = {
  getAll: async (params = {}) => (await api.get(API_ENDPOINTS.GUARDIANS, { params })).data,
  getById: async (id) => (await api.get(`${API_ENDPOINTS.GUARDIANS}/${id}`)).data,
  create: async (data) => (await api.post(API_ENDPOINTS.GUARDIANS, data)).data,
  update: async (id, data) => (await api.put(`${API_ENDPOINTS.GUARDIANS}/${id}`, data)).data,
  delete: async (id) => (await api.delete(`${API_ENDPOINTS.GUARDIANS}/${id}`)).data,
  getStudents: async (guardianId) => (await api.get(`${API_ENDPOINTS.GUARDIANS}/${guardianId}/students`)).data,
}