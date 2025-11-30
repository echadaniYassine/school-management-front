import { authApi, api } from '../client'
import { API_ENDPOINTS } from '@/constants'

export const registrationsService = {
  create: async (data) => (await authApi.post(API_ENDPOINTS.REGISTRATIONS, data)).data,
  getAll: async (params = {}) => (await api.get(API_ENDPOINTS.REGISTRATIONS, { params })).data,
  getById: async (id) => (await api.get(`${API_ENDPOINTS.REGISTRATIONS}/${id}`)).data,
  update: async (id, data) => (await api.put(`${API_ENDPOINTS.REGISTRATIONS}/${id}`, data)).data,
  delete: async (id) => (await api.delete(`${API_ENDPOINTS.REGISTRATIONS}/${id}`)).data,
  updateStatus: async (id, status) => (await api.patch(`${API_ENDPOINTS.REGISTRATIONS}/${id}/status`, { status })).data,
  getPending: async () => (await api.get(`${API_ENDPOINTS.REGISTRATIONS}?status=pending`)).data,
  approve: async (id) => registrationsService.updateStatus(id, 'confirmed'),
  reject: async (id, reason = '') => (await api.patch(`${API_ENDPOINTS.REGISTRATIONS}/${id}/status`, { status: 'rejected', reason })).data,
}