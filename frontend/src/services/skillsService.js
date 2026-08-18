import api from './api';

export const skillsService = {
  getSkills: () => api.get('/employee/skills/'),
  addSkill: (data) => api.post('/employee/skills/', data),
  updateSkill: (id, data) => api.put(`/employee/skills/${id}/`, data),
  deleteSkill: (id) => api.delete(`/employee/skills/${id}/`),
};