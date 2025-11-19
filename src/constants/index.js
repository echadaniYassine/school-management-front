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
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  PROGRAMS: '/programs',
  STUDENTS: '/students',
  TEACHERS: '/teachers',
  GUARDIANS: '/guardians',
  REGISTRATIONS: '/registrations',
  TIMETABLES: '/timetables', // ADD THIS

}

export const QUERY_KEYS = {
  ADMIN_STUDENTS: ['admin-students'],
  ADMIN_TEACHERS: ['admin-teachers'],
  ADMIN_GUARDIANS: ['admin-guardians'],
  ADMIN_PROGRAMS: ['admin-programs'],
  ADMIN_REGISTRATIONS: ['admin-registrations'],
  RECENT_ACTIVITIES: ['recent-activities'],
  ADMIN_TIMETABLES: (programId) => ['admin', 'timetables', programId], // ADD THIS
  WEEKLY_SCHEDULE: (programId) => ['schedule', programId], // ADD THIS
}