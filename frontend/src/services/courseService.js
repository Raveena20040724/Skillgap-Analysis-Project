import api from './api';

export const courseService = {
  getRecommendedCourses: () => api.get('/employee/courses/'),
  enrollCourse: (courseId) => api.post(`/employee/courses/${courseId}/enroll/`),
  updateCourseProgress: (courseId, progress) => api.patch(`/employee/courses/${courseId}/progress/`, { progress }),
};