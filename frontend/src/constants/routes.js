// Centralized route paths - avoids typos across the app
export const ROUTES = {
  // Public
  HOME: '/',
  EMPLOYEE_LOGIN: '/login/employee',
  EMPLOYEE_REGISTER: '/register/employee',
  HR_LOGIN: '/login/hr',
  ADMIN_LOGIN: '/login/admin',

  // Employee
  EMPLOYEE_DASHBOARD: '/employee/dashboard',
  EMPLOYEE_PROFILE: '/employee/profile',
  SKILLS_MANAGEMENT: '/employee/skills',
  EXPERIENCE_MANAGEMENT: '/employee/experience',
  RESUME_UPLOAD: '/employee/resume',
  SKILL_ASSESSMENT: '/employee/assessment',
  SKILL_GAP_RESULTS: '/employee/skill-gap',
  CAREER_RECOMMENDATIONS: '/employee/career-recommendations',
  LEARNING_PATH: '/employee/learning-path',
  COURSE_RECOMMENDATIONS: '/employee/courses',
  PROGRESS_TRACKING: '/employee/progress',
  NOTIFICATIONS: '/employee/notifications',
  SETTINGS: '/employee/settings',

  // HR
  HR_DASHBOARD: '/hr/dashboard',
  HR_PROFILE: '/hr/profile',
  HR_DIRECTORY: '/hr/directory',
  HR_REPORTS: '/hr/reports',
  HR_NOTIFICATIONS: '/hr/notifications',
  HR_SETTINGS: '/hr/settings',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_USERS: '/admin/users',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_DEPARTMENTS: '/admin/departments',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
};