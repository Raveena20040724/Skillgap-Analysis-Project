import api from './api';

export const hrService = {
  getOverviewStats: () => api.get('/hr/overview/'),
  getTeamSkillGaps: () => api.get('/hr/team-skill-gaps/'),
  getEmployees: (params) => api.get('/hr/employees/', { params }),
  getReports: () => api.get('/hr/reports/'),
};