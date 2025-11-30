import { authApi, api } from '../client'
import { API_ENDPOINTS } from '@/constants'

export const authService = {
  login: async (data) => (await authApi.post(API_ENDPOINTS.AUTH.LOGIN, data)).data,
  register: async (data) => (await authApi.post(API_ENDPOINTS.AUTH.REGISTER, data)).data,
  logout: async () => (await api.post(API_ENDPOINTS.AUTH.LOGOUT)).data,
  profile: async () => (await api.get(API_ENDPOINTS.AUTH.PROFILE)).data,
  changePassword: async (data) => (await api.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data)).data,
  forgotPassword: async (data) => (await authApi.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data)).data,
  resetPassword: async (data) => (await authApi.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)).data,
  verifyEmail: async (id, hash) => (await api.get(`/email/verify/${id}/${hash}`)).data,
  resendVerification: async () => (await api.post('/email/resend')).data,
}