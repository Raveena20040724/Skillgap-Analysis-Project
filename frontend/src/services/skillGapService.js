import api from './api';

export const skillGapService = {
  getSkillGapResults: () => api.get('/employee/skill-gap/'),
};