import { api } from '../client'

export const timetableService = {
  forProgram: async (programId, params = {}) => (await api.get(`/programs/${programId}/timetables`, { params })).data,
  getWeeklySchedule: async (programId, params = {}) => (await api.get(`/programs/${programId}/schedule`, { params })).data,
  create: async (data) => (await api.post('/timetables', data)).data,
  update: async (id, data) => (await api.put(`/timetables/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/timetables/${id}`)).data,
  bulkUpdate: async (programId, data) => (await api.post(`/programs/${programId}/timetables/bulk`, data)).data,
  clearSchedule: async (programId) => (await api.delete(`/programs/${programId}/timetables/clear`)).data,
}