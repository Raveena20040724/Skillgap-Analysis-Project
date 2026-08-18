import api from './api';

export const assessmentService = {
  getQuestions: (skillId) => api.get(`/employee/assessment/questions/?skill=${skillId}`),
  submitAssessment: (data) => api.post('/employee/assessment/submit/', data),
};