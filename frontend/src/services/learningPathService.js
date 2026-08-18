import api from './api';

export const learningPathService = {
  getLearningPath: () => api.get('/employee/learning-path/'),
  updateStepStatus: (stepId, status) => api.patch(`/employee/learning-path/${stepId}/`, { status }),
};