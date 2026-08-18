import api from './api';

export const resumeService = {
  getResume: () => api.get('/employee/resume/'),
  uploadResume: (formData) =>
    api.post('/employee/resume/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteResume: () => api.delete('/employee/resume/'),
};