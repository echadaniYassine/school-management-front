import { api } from '../client'
import { API_ENDPOINTS } from '@/constants'

export const teachersService = {
  getAll: async (params = {}) => (await api.get(API_ENDPOINTS.TEACHERS, { params })).data,
  getById: async (id) => (await api.get(`${API_ENDPOINTS.TEACHERS}/${id}`)).data,
  create: async (data) => (await api.post(API_ENDPOINTS.TEACHERS, data)).data,
  update: async (id, data) => (await api.put(`${API_ENDPOINTS.TEACHERS}/${id}`, data)).data,
  delete: async (id) => (await api.delete(`${API_ENDPOINTS.TEACHERS}/${id}`)).data,
  getBySubject: async (subject) => (await api.get(`${API_ENDPOINTS.TEACHERS}?subject=${encodeURIComponent(subject)}`)).data,
  getSchedule: async (teacherId) => (await api.get(`${API_ENDPOINTS.TEACHERS}/${teacherId}/schedule`)).data,
}