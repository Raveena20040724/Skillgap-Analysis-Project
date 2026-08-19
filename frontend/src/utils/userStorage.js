// Utility module for per-user isolated storage and real-time state synchronization

export const getActiveUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getActiveUserIdentifier = () => {
  const user = getActiveUser();
  if (!user) return 'guest';
  return (user.username || user.email || user.name || `user_${user.id || 'anonymous'}`).toLowerCase().replace(/[^a-z0-9_]/g, '_');
};

export const getUserStorageKey = (key, customIdentifier = null) => {
  const identifier = customIdentifier ? customIdentifier.toLowerCase().replace(/[^a-z0-9_]/g, '_') : getActiveUserIdentifier();
  return `emp_${identifier}_${key}`;
};

export const getUserData = (key, fallback = null) => {
  try {
    const fullKey = getUserStorageKey(key);
    const item = localStorage.getItem(fullKey);
    if (item === null) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading key ${key} for active user:`, err);
    return fallback;
  }
};

export const setUserData = (key, data) => {
  try {
    const fullKey = getUserStorageKey(key);
    localStorage.setItem(fullKey, JSON.stringify(data));
    // Dispatch custom event for real-time reactive sync across components
    window.dispatchEvent(new CustomEvent('userDataChanged', { detail: { key, fullKey, data } }));
    return true;
  } catch (err) {
    console.error(`Error saving key ${key} for active user:`, err);
    return false;
  }
};

export const removeUserData = (key) => {
  try {
    const fullKey = getUserStorageKey(key);
    localStorage.removeItem(fullKey);
    window.dispatchEvent(new CustomEvent('userDataChanged', { detail: { key, fullKey, data: null } }));
  } catch (err) {
    console.error(`Error removing key ${key}:`, err);
  }
};

// Initialize clean environment for newly registered user
export const initNewUserEnvironment = (username, details = {}) => {
  const identifier = (username || 'new_employee').toLowerCase().replace(/[^a-z0-9_]/g, '_');
  
  // 1. Fresh empty skills list
  localStorage.setItem(`emp_${identifier}_skills`, JSON.stringify([]));
  
  // 2. Fresh empty resume info and data
  localStorage.removeItem(`emp_${identifier}_resume_info`);
  localStorage.removeItem(`emp_${identifier}_resume_file_data`);
  localStorage.removeItem(`emp_${identifier}_resume_skills`);

  // 3. Fresh empty assessment history
  localStorage.setItem(`emp_${identifier}_assessment_results`, JSON.stringify([]));

  // 4. Fresh empty course enrollments
  localStorage.setItem(`emp_${identifier}_enrolled_courses`, JSON.stringify([]));

  // 5. Clean initial profile containing ONLY registered info (No stock photo, no fake bio/designation/exp)
  const initialProfile = {
    name: details.name || details.username || username,
    email: details.email || '',
    phone: details.phone || '',
    department: details.department || '',
    designation: '',
    experienceYears: 0,
    bio: '',
    location: '',
    avatar: '',
    linkedin: '',
    github: '',
    portfolio: '',
    workExperience: [],
    certifications: [],
    projects: [],
    technicalSkills: []
  };
  localStorage.setItem(`emp_${identifier}_profile`, JSON.stringify(initialProfile));

  // 6. Initial single welcome notification
  const welcomeNotification = {
    id: `notif_${Date.now()}`,
    title: `Welcome to SkillGap, ${details.username || username}!`,
    message: `Your account is ready. Get started by uploading your resume or adding your skills in Skills Management.`,
    category: 'Onboarding & Welcome',
    time: 'Just now',
    date: new Date().toISOString().split('T')[0],
    read: false,
    type: 'welcome',
    severity: 'info',
    actionLabel: 'Upload Resume',
    link: '/employee/resume-upload'
  };

  localStorage.setItem(`emp_${identifier}_alerts_list`, JSON.stringify([welcomeNotification]));
};

// Push a new notification for active user
export const addActiveUserNotification = (notification) => {
  try {
    const currentAlerts = getUserData('alerts_list', []);
    const newAlert = {
      id: notification.id || `notif_${Date.now()}`,
      title: notification.title || 'System Update',
      message: notification.message || '',
      category: notification.category || 'Skill Growth',
      time: 'Just now',
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: notification.type || 'info',
      severity: notification.severity || 'info',
      actionLabel: notification.actionLabel || 'View',
      link: notification.link || '/employee/dashboard',
      ...notification
    };
    const updated = [newAlert, ...(Array.isArray(currentAlerts) ? currentAlerts : [])];
    setUserData('alerts_list', updated);
    window.dispatchEvent(new Event('notificationsUpdated'));
    return newAlert;
  } catch (err) {
    console.error('Error adding user notification:', err);
    return null;
  }
};
