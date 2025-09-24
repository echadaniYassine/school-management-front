// src/constants/index.js - Application constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROGRAMS: '/programs',
  STUDENTS: '/students',
  TEACHERS: '/teachers',
  GUARDIANS: '/guardians',
  REGISTRATIONS: '/registrations',
  PROFILE: '/profile'
}

export const USER_ROLES = {
  ADMIN: 'admin',
  GUARDIAN: 'guardian',
  STUDENT: 'student'
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    PROFILE: '/profile'
  },
  PROGRAMS: '/programs',
  STUDENTS: '/students',
  TEACHERS: '/teachers',
  GUARDIANS: '/guardians',
  REGISTRATIONS: '/registrations'
}

export const QUERY_KEYS = {
  ADMIN_STUDENTS: ['admin-students'],
  ADMIN_TEACHERS: ['admin-teachers'],
  ADMIN_GUARDIANS: ['admin-guardians'],
  ADMIN_PROGRAMS: ['admin-programs'],
  ADMIN_REGISTRATIONS: ['admin-registrations'],
  RECENT_ACTIVITIES: ['recent-activities']
}