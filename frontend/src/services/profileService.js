import api from './api';

export const profileService = {
  getProfile: () => api.get('/employee/profile/'),
  updateProfile: (data) => api.put('/employee/profile/', data),
};