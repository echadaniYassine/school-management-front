import { api } from '../client'
import { API_ENDPOINTS } from '@/constants'

export const subjectsService = {
  getAll: async (params = {}) => (await api.get(API_ENDPOINTS.SUBJECTS, { params })).data,
  getById: async (id) => (await api.get(`${API_ENDPOINTS.SUBJECTS}/${id}`)).data,
  create: async (data) => (await api.post(API_ENDPOINTS.SUBJECTS, data)).data,
  update: async (id, data) => (await api.put(`${API_ENDPOINTS.SUBJECTS}/${id}`, data)).data,
  delete: async (id) => (await api.delete(`${API_ENDPOINTS.SUBJECTS}/${id}`)).data,
}
