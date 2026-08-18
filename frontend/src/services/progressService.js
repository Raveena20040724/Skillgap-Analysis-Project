import api from './api';

export const progressService = {
  getProgress: () => api.get('/employee/progress/'),
};