import api from './api';

export const careerService = {
  getRecommendations: () => api.get('/employee/career-recommendations/'),
};