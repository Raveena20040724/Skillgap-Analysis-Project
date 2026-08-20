import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth pages
import EmployeeLogin from '../pages/auth/EmployeeLogin';
import EmployeeRegister from '../pages/auth/EmployeeRegister';
import HrLogin from '../pages/auth/HrLogin';
import AdminLogin from '../pages/auth/AdminLogin';

// Employee pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import EmployeeProfile from '../pages/employee/EmployeeProfile';
import SkillsManagement from '../pages/employee/SkillsManagement';
import ExperienceManagement from '../pages/employee/ExperienceManagement';
import ResumeUpload from '../pages/employee/ResumeUpload';
import SkillAssessment from '../pages/employee/SkillAssessment';
import SkillGapResults from '../pages/employee/SkillGapResults';
import CareerRecommendations from '../pages/employee/CareerRecommendations';
import LearningPath from '../pages/employee/LearningPath';
import CourseRecommendations from '../pages/employee/CourseRecommendations';
import ProgressTracking from '../pages/employee/ProgressTracking';
import NotificationsPage from '../pages/employee/NotificationsPage';
import SettingsPage from '../pages/employee/SettingsPage';

// HR / Admin
import HrDashboard from '../pages/hr/HrDashboard';
import HrProfile from '../pages/hr/HrProfile';
import EmployeeDirectory from '../pages/hr/EmployeeDirectory';
import HrReports from '../pages/hr/HrReports';
import HrNotifications from '../pages/hr/HrNotifications';
import HrSettings from '../pages/hr/HrSettings';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProfile from '../pages/admin/AdminProfile';
import UserManagement from '../pages/admin/UserManagement';
import RolesAccess from '../pages/admin/RolesAccess';
import DepartmentsManagement from '../pages/admin/DepartmentsManagement';
import SystemReports from '../pages/admin/SystemReports';
import SystemSettings from '../pages/admin/SystemSettings';
import AdminNotifications from '../pages/admin/AdminNotifications';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.EMPLOYEE_LOGIN} element={<EmployeeLogin />} />
      <Route path={ROUTES.EMPLOYEE_REGISTER} element={<EmployeeRegister />} />
      <Route path={ROUTES.HR_LOGIN} element={<HrLogin />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />

      {/* Protected Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.EMPLOYEE_DASHBOARD} element={<EmployeeDashboard />} />
        <Route path={ROUTES.EMPLOYEE_PROFILE} element={<EmployeeProfile />} />
        <Route path={ROUTES.SKILLS_MANAGEMENT} element={<SkillsManagement />} />
        <Route path={ROUTES.EXPERIENCE_MANAGEMENT} element={<ExperienceManagement />} />
        <Route path={ROUTES.RESUME_UPLOAD} element={<ResumeUpload />} />
        <Route path={ROUTES.SKILL_ASSESSMENT} element={<SkillAssessment />} />
        <Route path={ROUTES.SKILL_GAP_RESULTS} element={<SkillGapResults />} />
        <Route path={ROUTES.CAREER_RECOMMENDATIONS} element={<CareerRecommendations />} />
        <Route path={ROUTES.LEARNING_PATH} element={<LearningPath />} />
        <Route path={ROUTES.COURSE_RECOMMENDATIONS} element={<CourseRecommendations />} />
        <Route path={ROUTES.PROGRESS_TRACKING} element={<ProgressTracking />} />
        {/* Employee Notifications and Settings */}
        <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* HR routes */}
        <Route path={ROUTES.HR_DASHBOARD} element={<HrDashboard />} />
        <Route path={ROUTES.HR_PROFILE} element={<HrProfile />} />
        <Route path={ROUTES.HR_DIRECTORY} element={<EmployeeDirectory />} />
        <Route path={ROUTES.HR_REPORTS} element={<HrReports />} />
        <Route path={ROUTES.HR_NOTIFICATIONS} element={<HrNotifications />} />
        <Route path={ROUTES.HR_SETTINGS} element={<HrSettings />} />

        {/* Admin routes */}
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN_PROFILE} element={<AdminProfile />} />
        <Route path={ROUTES.ADMIN_USERS} element={<UserManagement />} />
        <Route path={ROUTES.ADMIN_ROLES} element={<RolesAccess />} />
        <Route path={ROUTES.ADMIN_DEPARTMENTS} element={<DepartmentsManagement />} />
        <Route path={ROUTES.ADMIN_REPORTS} element={<SystemReports />} />
        <Route path={ROUTES.ADMIN_SETTINGS} element={<SystemSettings />} />
        <Route path={ROUTES.ADMIN_NOTIFICATIONS} element={<AdminNotifications />} />
      </Route>

      {/* Default */}
      <Route path="/" element={<EmployeeLogin />} />
    </Routes>
  );
};

export default AppRoutes;