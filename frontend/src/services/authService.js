import api from './api';

export const authService = {
  register: (data) => api.post('/accounts/register/', data),
  login: (data) => api.post('/accounts/login/', data),
  refreshToken: (refresh) => api.post('/accounts/login/refresh/', { refresh }),
  getCurrentUser: () => api.get('/accounts/me/'),
  createHR: (data) => api.post('/accounts/create-hr/', data),
  changePassword: (data) => api.post('/accounts/change-password/', data),
  sendOtp: (data) => api.post('/accounts/send-otp/', data),
  verifyChangePassword: (data) => api.post('/accounts/verify-change-password/', data),
};
