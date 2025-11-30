export class ApiError extends Error {
  constructor(error) {
    super(error.message || 'An API error occurred')
    this.name = 'ApiError'
    this.status = error.response?.status
    this.data = error.response?.data
    this.originalError = error
  }
}

export const handleApiError = (error) => {
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