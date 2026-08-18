import api from './api';

export const adminService = {
  getSystemStats: () => api.get('/admin/stats/'),
  getAllUsers: () => api.get('/admin/users/'),
  createUser: (data) => api.post('/admin/users/', data),
  updateUserStatus: (id, payload) => api.patch(`/admin/users/${id}/`, typeof payload === 'object' ? payload : { status: payload }),
  deleteUser: (id) => api.delete(`/admin/users/${id}/`),
};