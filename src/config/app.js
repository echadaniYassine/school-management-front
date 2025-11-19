// src/config/app.js - Application configuration
export const APP_CONFIG = {
  name: 'SchoolMS',
  version: '1.0.0',
  description: 'School Management System',
  author: 'Your Team',
  
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 10000,
    retries: 2
  },

  // Authentication
  auth: {
    tokenKey: 'auth_token',
    userKey: 'auth_user',
    refreshKey: 'refresh_token'
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100]
  },

  // File uploads
  uploads: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    maxFiles: 5
  },

  // Theme
  theme: {
    default: 'system',
    options: ['light', 'dark', 'system']
  },

  // Languages
  languages: {
    default: 'en',
    available: ['en', 'fr', 'ar']
  }
}