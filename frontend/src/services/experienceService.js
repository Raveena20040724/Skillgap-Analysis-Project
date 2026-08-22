import api from './api';

export const experienceService = {
  getExperience: () => api.get('/employee/experience/'),
  getExperiences: () => api.get('/employee/experience/'),
  addExperience: (data) => api.post('/employee/experience/', data),
  updateExperience: (id, data) => api.put(`/employee/experience/${id}/`, data),
  deleteExperience: (id) => api.delete(`/employee/experience/${id}/`),
};