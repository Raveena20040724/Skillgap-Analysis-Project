import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../constants/routes';
import { getUserData, formatRelativeTime, deduplicateNotifications } from '../utils/userStorage';
import { useActiveTimeTracker } from '../hooks/useActiveTimeTracker';
import {
  SunFill,
  MoonFill,
  BoxArrowRight,
  Speedometer2,
  LightningFill,
  BriefcaseFill,
  FileEarmarkTextFill,
  Check2Square,
  BarChartFill,
  CompassFill,
  MortarboardFill,
  BookHalf,
  GraphUpArrow,
  PersonFill,
  BellFill,
  GearFill,
  ChevronDown,
  Search,
  PeopleFill,
  BuildingFill
} from 'react-bootstrap-icons';
import {
  BrainCircuit,
  LayoutGrid,
  Users,
  ShieldCheck,
  Building2,
  PieChart,
  Sliders,
  User
} from 'lucide-react';

const DashboardLayout = () => {
  useActiveTimeTracker();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const dropdownRef = useRef(null);
  const portalRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Active workspace mode detection
  const isAdmin = location.pathname.startsWith('/admin');
  const isHr = location.pathname.startsWith('/hr');

  const workspaceName = isAdmin
    ? 'Admin Workspace'
    : isHr
      ? 'HR Workspace'
      : 'Employee Workspace';

  const portalLabel = isAdmin
    ? 'Admin Portal'
    : isHr
      ? 'Hr Portal'
      : 'Employee Portal';

  const notificationsPath = isAdmin
    ? ROUTES.ADMIN_NOTIFICATIONS
    : isHr
      ? ROUTES.HR_NOTIFICATIONS
      : ROUTES.NOTIFICATIONS;

  const settingsPath = isAdmin
    ? ROUTES.ADMIN_SETTINGS
    : isHr
      ? ROUTES.HR_SETTINGS
      : ROUTES.SETTINGS;

  const profilePath = isAdmin
    ? ROUTES.ADMIN_PROFILE
    : isHr
      ? ROUTES.HR_PROFILE
      : ROUTES.EMPLOYEE_PROFILE;

  // Search items database strictly isolated for current portal (Live data dynamically loaded from system state)
  const getSearchDatabase = () => {
    if (isAdmin) {
      // 1. Admin Pages ONLY
      const adminPages = [
        { label: 'Admin Dashboard', category: 'Admin Page', path: ROUTES.ADMIN_DASHBOARD, desc: 'Live telemetry, system health & KPIs' },
        { label: 'User Management', category: 'Admin Page', path: ROUTES.ADMIN_USERS, desc: 'Manage workforce & HR managers' },
        { label: 'Roles & Access (RBAC)', category: 'Admin Page', path: ROUTES.ADMIN_ROLES, desc: 'Configure system permissions matrix' },
        { label: 'Departments Management', category: 'Admin Page', path: ROUTES.ADMIN_DEPARTMENTS, desc: 'Manage organizational units & benchmarks' },
        { label: 'System Reports & Telemetry', category: 'Admin Page', path: ROUTES.ADMIN_REPORTS, desc: 'Download audit logs & real datasets' },
        { label: 'System Settings & Security', category: 'Admin Page', path: ROUTES.ADMIN_SETTINGS, desc: 'Change password & preferences' },
        { label: 'System Alerts & Audit Logs', category: 'Admin Page', path: ROUTES.ADMIN_NOTIFICATIONS, desc: 'View administrative notifications' },
        { label: 'Administrator Profile', category: 'Admin Page', path: ROUTES.ADMIN_PROFILE, desc: 'Admin account identity & credentials' },
      ];

      // 2. Admin System Users (HR accounts created in Admin)
      let adminUsers = [];
      try {
        const savedHrs = JSON.parse(localStorage.getItem('all_hr_users_list') || '[]');
        const customHrs = JSON.parse(localStorage.getItem('custom_hr_users') || '[]');
        const mergedHrs = [...savedHrs, ...customHrs];
        const seenEmails = new Set();
        mergedHrs.forEach((u) => {
          if (u && u.email && !seenEmails.has(u.email.toLowerCase())) {
            seenEmails.add(u.email.toLowerCase());
            adminUsers.push({
              label: u.name || 'System User',
              category: 'System Account',
              desc: `Role: ${u.role || 'HR'} • Email: ${u.email} • Dept: ${u.department || 'General'}`,
              path: ROUTES.ADMIN_USERS
            });
          }
        });
      } catch (e) {
        console.warn('Admin user search load:', e);
      }

      // 3. Admin Departments
      let adminDepts = [];
      try {
        const savedDepts = JSON.parse(localStorage.getItem('custom_departments_list') || '[]');
        if (Array.isArray(savedDepts)) {
          savedDepts.forEach((d) => {
            if (d && d.name) {
              adminDepts.push({
                label: `${d.name} (${d.code || 'DEP'})`,
                category: 'Department',
                desc: `Lead: ${d.lead || 'Head'} • Benchmark: ${d.targetScore || 85}%`,
                path: ROUTES.ADMIN_DEPARTMENTS
              });
            }
          });
        }
      } catch (e) {
        console.warn('Admin department search load:', e);
      }

      // 4. Admin RBAC Roles
      const adminRoles = [
        { label: 'Administrator Role', category: 'System Role', desc: 'Full root access, RBAC management, system audit permissions', path: ROUTES.ADMIN_ROLES },
        { label: 'HR Manager Role', category: 'System Role', desc: 'Talent management, candidate sync, team gap analysis', path: ROUTES.ADMIN_ROLES },
        { label: 'Department Lead Role', category: 'System Role', desc: 'Team evaluations, performance metrics, approval workflows', path: ROUTES.ADMIN_ROLES },
      ];

      return [...adminPages, ...adminUsers, ...adminDepts, ...adminRoles];
    }

    if (isHr) {
      // 1. HR Pages ONLY
      const hrPages = [
        { label: 'HR Dashboard', category: 'HR Page', path: ROUTES.HR_DASHBOARD, desc: 'Workforce analytics & skill readiness' },
        { label: 'HR Profile', category: 'HR Page', path: ROUTES.HR_PROFILE, desc: 'HR Manager account identity, photo & details' },
        { label: 'Workforce & Employee Directory', category: 'HR Page', path: ROUTES.HR_DIRECTORY, desc: 'Browse talent, profiles & competencies' },
        { label: 'Skill Gap Reports', category: 'HR Page', path: ROUTES.HR_REPORTS, desc: 'Department benchmark reports' },
        { label: 'HR Notification Hub', category: 'HR Page', path: ROUTES.HR_NOTIFICATIONS, desc: 'HR telemetry alerts' },
        { label: 'HR Workspace Settings', category: 'HR Page', path: ROUTES.HR_SETTINGS, desc: 'HR preferences & security' },
      ];

      // 2. Directory Personnel
      let directoryPersonnel = [];
      try {
        const savedEmps = JSON.parse(localStorage.getItem('custom_employee_directory') || '[]');
        const baseEmps = [
          { name: 'Alex Morgan', designation: 'Senior Frontend Developer', department: 'Engineering', skillReadinessScore: 84 },
          { name: 'Sophia Patel', designation: 'Senior ML Engineer', department: 'Data Science & AI', skillReadinessScore: 91 },
          { name: 'David Chen', designation: 'Backend DevOps Engineer', department: 'Engineering', skillReadinessScore: 78 },
          { name: 'Emily Watson', designation: 'Lead Product Designer', department: 'UI/UX Design', skillReadinessScore: 88 }
        ];
        const allEmps = Array.isArray(savedEmps) && savedEmps.length > 0 ? savedEmps : baseEmps;
        const seenNames = new Set();
        allEmps.forEach((emp) => {
          if (emp && emp.name && !seenNames.has(emp.name.toLowerCase())) {
            seenNames.add(emp.name.toLowerCase());
            directoryPersonnel.push({
              label: emp.name,
              category: 'Directory Personnel',
              desc: `${emp.designation || 'Specialist'} • ${emp.department || 'Engineering'} • Score: ${emp.skillReadinessScore || 80}%`,
              path: ROUTES.HR_DIRECTORY
            });
          }
        });
      } catch (e) {
        console.warn('HR directory search load:', e);
      }

      // 3. Monitored Departments
      let hrDepts = [];
      try {
        const savedDepts = JSON.parse(localStorage.getItem('custom_departments_list') || '[]');
        const defaultDepts = [
          { name: 'Engineering', code: 'ENG', lead: 'David Chen', targetScore: 85 },
          { name: 'Data Science & AI', code: 'DS', lead: 'Sophia Patel', targetScore: 90 },
          { name: 'UI/UX Design', code: 'UX', lead: 'Emily Watson', targetScore: 82 },
          { name: 'Product Management', code: 'PM', lead: 'Michael Scott', targetScore: 88 }
        ];
        const depts = Array.isArray(savedDepts) && savedDepts.length > 0 ? savedDepts : defaultDepts;
        depts.forEach((d) => {
          if (d && d.name) {
            hrDepts.push({
              label: `${d.name} (${d.code || 'DEP'})`,
              category: 'Department',
              desc: `Monitored Department • Lead: ${d.lead || 'Head'} • Benchmark: ${d.targetScore || 85}%`,
              path: ROUTES.HR_DASHBOARD
            });
          }
        });
      } catch (e) {
        console.warn('HR department search load:', e);
      }

      return [...hrPages, ...directoryPersonnel, ...hrDepts];
    }

    // 3. EMPLOYEE PORTAL ONLY
    // 1. Employee Pages
    const employeePages = [
      { label: 'Employee Dashboard', category: 'Employee Page', path: ROUTES.EMPLOYEE_DASHBOARD, desc: 'Personal readiness & overview' },
      { label: 'My Profile & Details', category: 'Employee Page', path: ROUTES.EMPLOYEE_PROFILE, desc: 'Edit personal info & portfolio' },
      { label: 'Resume Parser & Upload', category: 'Employee Page', path: ROUTES.RESUME_UPLOAD, desc: 'Upload and parse your CV' },
      { label: 'Skills Portfolio', category: 'Employee Page', path: ROUTES.SKILLS_MANAGEMENT, desc: 'Manage verified technical skills' },
      { label: 'Experience & History', category: 'Employee Page', path: ROUTES.EXPERIENCE_MANAGEMENT, desc: 'Work experience & roles' },
      { label: 'Skill Assessment Quiz', category: 'Employee Page', path: ROUTES.SKILL_ASSESSMENT, desc: 'Take technical competency tests' },
      { label: 'Skill Gap Results', category: 'Employee Page', path: ROUTES.SKILL_GAP_RESULTS, desc: 'AI analysis & targeted improvements' },
      { label: 'Career Recommendations', category: 'Employee Page', path: ROUTES.CAREER_RECOMMENDATIONS, desc: 'Explore career progression' },
      { label: 'Learning Path Roadmap', category: 'Employee Page', path: ROUTES.LEARNING_PATH, desc: 'Milestone-based learning roadmap' },
      { label: 'Course Recommendations', category: 'Employee Page', path: ROUTES.COURSE_RECOMMENDATIONS, desc: 'Curated technical courses' },
      { label: 'Progress Tracking', category: 'Employee Page', path: ROUTES.PROGRESS_TRACKING, desc: 'Weekly learning statistics' },
      { label: 'Notifications', category: 'Employee Page', path: ROUTES.NOTIFICATIONS, desc: 'Personal updates & alerts' },
      { label: 'Settings', category: 'Employee Page', path: ROUTES.SETTINGS, desc: 'Security credentials & theme' },
    ];

    // 2. Employee Skills
    let employeeSkills = [];
    try {
      const savedSkills = JSON.parse(localStorage.getItem('custom_user_skills') || '[]');
      const resumeSkills = JSON.parse(localStorage.getItem('employee_resume_skills') || '[]');
      const defaultSkills = [
        { name: 'React.js', category: 'Frontend', level: 'Advanced' },
        { name: 'TypeScript', category: 'Frontend', level: 'Advanced' },
        { name: 'Node.js', category: 'Backend', level: 'Intermediate' },
        { name: 'Python', category: 'Data/AI', level: 'Intermediate' },
        { name: 'Docker & Kubernetes', category: 'DevOps', level: 'Beginner' }
      ];
      const allSkills = [...savedSkills, ...resumeSkills, ...defaultSkills];
      const seenSkills = new Set();
      allSkills.forEach((sk) => {
        if (sk && sk.name && !seenSkills.has(sk.name.toLowerCase())) {
          seenSkills.add(sk.name.toLowerCase());
          employeeSkills.push({
            label: sk.name,
            category: 'Skill',
            desc: `Skill • Category: ${sk.category || 'Technical'} • Level: ${sk.level || 'Intermediate'}`,
            path: ROUTES.SKILLS_MANAGEMENT
          });
        }
      });
    } catch (e) {
      console.warn('Employee skill search load:', e);
    }

    // 3. Recommended Courses
    const courses = [
      { label: 'Advanced React & Micro-frontends', category: 'Course', desc: 'Architecture patterns, performance optimization & state machines', path: ROUTES.COURSE_RECOMMENDATIONS },
      { label: 'Cloud Architecture & Kubernetes Deep Dive', category: 'Course', desc: 'Container orchestration, CI/CD pipelines & GCP infrastructure', path: ROUTES.COURSE_RECOMMENDATIONS },
      { label: 'PyTorch & Generative AI Model Deployment', category: 'Course', desc: 'LLM fine-tuning, embeddings & inference optimization', path: ROUTES.COURSE_RECOMMENDATIONS },
      { label: 'Enterprise Design Systems & UX Research', category: 'Course', desc: 'Scalable UI components, accessibility & user research', path: ROUTES.COURSE_RECOMMENDATIONS }
    ];

    // 4. Career Roles
    const careers = [
      { label: 'Senior Fullstack Architect', category: 'Career Path', desc: 'Target Match: 88% • Key Skills: React, Node.js, Cloud Architecture', path: ROUTES.CAREER_RECOMMENDATIONS },
      { label: 'Staff ML Engineer', category: 'Career Path', desc: 'Target Match: 82% • Key Skills: Python, PyTorch, BigQuery ML', path: ROUTES.CAREER_RECOMMENDATIONS },
      { label: 'Cloud Platform DevOps Lead', category: 'Career Path', desc: 'Target Match: 76% • Key Skills: Kubernetes, Terraform, CI/CD', path: ROUTES.CAREER_RECOMMENDATIONS }
    ];

    return [...employeePages, ...employeeSkills, ...courses, ...careers];
  };

  const searchDatabase = getSearchDatabase();
  const searchResults = globalSearch.trim()
    ? searchDatabase.filter(item =>
      item.label.toLowerCase().includes(globalSearch.toLowerCase()) ||
      item.desc.toLowerCase().includes(globalSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(globalSearch.toLowerCase())
    )
    : [];

  const handleSelectSearchResult = (path) => {
    setGlobalSearch('');
    setSearchOpen(false);
    navigate(path);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSelectSearchResult(searchResults[0].path);
    }
    if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  // Dynamic Navigation Items matching user photo
  const getNavItems = () => {
    if (isAdmin) {
      return [
        { label: 'Admin Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: LayoutGrid, isLucide: true },
        { label: 'User Management', path: ROUTES.ADMIN_USERS, icon: Users, isLucide: true },
        { label: 'Roles & Access', path: ROUTES.ADMIN_ROLES, icon: ShieldCheck, isLucide: true },
        { label: 'Departments', path: ROUTES.ADMIN_DEPARTMENTS, icon: Building2, isLucide: true },
        { label: 'System Reports', path: ROUTES.ADMIN_REPORTS, icon: PieChart, isLucide: true },
        { label: 'System Settings', path: ROUTES.ADMIN_SETTINGS, icon: Sliders, isLucide: true },
        { label: 'System Alerts', path: ROUTES.ADMIN_NOTIFICATIONS, icon: BellFill },
        { label: 'Admin Profile', path: ROUTES.ADMIN_PROFILE, icon: User, isLucide: true },
      ];
    }

    if (isHr) {
      return [
        { label: 'HR Dashboard', path: ROUTES.HR_DASHBOARD, icon: LayoutGrid, isLucide: true },
        { label: 'HR Profile', path: ROUTES.HR_PROFILE, icon: User, isLucide: true },
        { label: 'Employee Directory', path: ROUTES.HR_DIRECTORY, icon: Users, isLucide: true },
        { label: 'Skill Reports', path: ROUTES.HR_REPORTS, icon: PieChart, isLucide: true },
        { label: 'Notifications', path: ROUTES.HR_NOTIFICATIONS, icon: BellFill },
        { label: 'Settings', path: ROUTES.HR_SETTINGS, icon: GearFill },
      ];
    }

    return [
      { label: 'Dashboard', path: ROUTES.EMPLOYEE_DASHBOARD, icon: Speedometer2 },
      { label: 'Profile', path: ROUTES.EMPLOYEE_PROFILE, icon: PersonFill },
      { label: 'Resume', path: ROUTES.RESUME_UPLOAD, icon: FileEarmarkTextFill },
      { label: 'Skills', path: ROUTES.SKILLS_MANAGEMENT, icon: LightningFill },
      { label: 'Assessments', path: ROUTES.SKILL_ASSESSMENT, icon: Check2Square },
      { label: 'Skill Gap Analysis', path: ROUTES.SKILL_GAP_RESULTS, icon: BarChartFill },
      { label: 'Career Paths', path: ROUTES.CAREER_RECOMMENDATIONS, icon: CompassFill },
      { label: 'Learning Path', path: ROUTES.LEARNING_PATH, icon: MortarboardFill },
      { label: 'Courses', path: ROUTES.COURSE_RECOMMENDATIONS, icon: BookHalf },
      { label: 'Progress Tracking', path: ROUTES.PROGRESS_TRACKING, icon: GraphUpArrow },
      { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: BellFill },
    ];
  };

  const navItems = getNavItems();

  // Initial Notifications State tailored by role
  const getInitialNotifications = () => {
    if (isAdmin) {
      return [
        {
          id: 1,
          title: 'PostgreSQL Database Synced',
          message: 'Database "skillgap_app_db" verified online with zero latency.',
          time: '10m ago',
          read: false,
        },
        {
          id: 2,
          title: 'HR Manager Account Provisioned',
          message: 'Sarah Jenkins created with full HR Directory & Reports access.',
          time: '45m ago',
          read: false,
        },
        {
          id: 3,
          title: 'Security Audit: Role Modified',
          message: 'Global permission matrix for Role "HR Manager" modified.',
          time: '2h ago',
          read: false,
        },
      ];
    }
    if (isHr) {
      return [
        {
          id: 1,
          title: 'Employee Assessment Completed',
          message: 'Alex Morgan scored 94% on Advanced React Architecture.',
          time: '15m ago',
          read: false,
        },
        {
          id: 2,
          title: 'Department Skill Gap Alert',
          message: 'Engineering department has 38% critical gap in Cloud architecture.',
          time: '1h ago',
          read: false,
        },
        {
          id: 3,
          title: 'New Resume Synced',
          message: 'Marcus Chen added to directory with 8 extracted technical skills.',
          time: '3h ago',
          read: false,
        },
      ];
    }
    return [
      {
        id: 1,
        title: 'AI Skill Gap Analysis Ready',
        message: 'Your latest skill assessment has been processed. 4 skill gaps identified for Senior Frontend role.',
        time: '10m ago',
        read: false,
      },
      {
        id: 2,
        title: 'New Recommended Course',
        message: 'Advanced React Design Systems course added to your learning pathway.',
        time: '1h ago',
        read: false,
      },
      {
        id: 3,
        title: 'Resume Successfully Parsed',
        message: 'CV telemetry updated. 8 technical skills extracted and synced with profile.',
        time: '2h ago',
        read: false,
      },
    ];
  };

  const notifStorageKey = isAdmin
    ? 'admin_alerts_list'
    : isHr
      ? 'hr_alerts_list'
      : 'employee_alerts_list';

  const [notifications, setNotifications] = useState(() => {
    try {
      if (!isAdmin && !isHr) {
        const userAlerts = getUserData('alerts_list', null);
        if (userAlerts !== null) return userAlerts;
      }
      const saved = localStorage.getItem(notifStorageKey);
      return saved ? JSON.parse(saved) : getInitialNotifications();
    } catch {
      return getInitialNotifications();
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Sync notifications on route change or event
  useEffect(() => {
    const syncNotifs = () => {
      try {
        if (!isAdmin && !isHr) {
          const userAlerts = getUserData('alerts_list', null);
          if (userAlerts !== null) {
            setNotifications(deduplicateNotifications(userAlerts));
            return;
          }
        }
        const saved = localStorage.getItem(notifStorageKey);
        if (saved) {
          setNotifications(deduplicateNotifications(JSON.parse(saved)));
        } else {
          setNotifications(getInitialNotifications());
        }
      } catch {
        setNotifications(getInitialNotifications());
      }
    };

    syncNotifs();
    window.addEventListener('notificationsUpdated', syncNotifs);
    window.addEventListener('userDataChanged', syncNotifs);
    return () => {
      window.removeEventListener('notificationsUpdated', syncNotifs);
      window.removeEventListener('userDataChanged', syncNotifs);
    };
  }, [location.pathname, notifStorageKey, isAdmin, isHr]);

  // Real-time live ticker to update relative notification timestamps dynamically
  const [, setNotifTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setNotifTick(t => t + 1), 10000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (portalRef.current && !portalRef.current.contains(event.target)) {
        setPortalDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate(ROUTES.EMPLOYEE_LOGIN);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    if (!isAdmin && !isHr) {
      setUserData('alerts_list', updated);
    } else {
      localStorage.setItem(notifStorageKey, JSON.stringify(updated));
    }
    window.dispatchEvent(new Event('notificationsUpdated'));
  };

  const handleToggleNotifBell = () => {
    const nextOpen = !notifOpen;
    setNotifOpen(nextOpen);
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  const handleReadNotif = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    if (!isAdmin && !isHr) {
      setUserData('alerts_list', updated);
    } else {
      localStorage.setItem(notifStorageKey, JSON.stringify(updated));
    }
    window.dispatchEvent(new Event('notificationsUpdated'));
    setNotifOpen(false);
    navigate(notificationsPath);
  };

  const initialLetter = (user?.name || user?.username || (isAdmin ? 'Admin' : isHr ? 'HR' : 'Employee')).charAt(0).toUpperCase();

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-100 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar - Fixed full height */}
      <aside className="w-64 h-full bg-white dark:bg-[#161f33] border-r border-slate-200 dark:border-slate-800/80 flex flex-col shrink-0 shadow-lg dark:shadow-none z-20 overflow-y-auto">
        {/* Brand Header with Exact SkillBridge.AI Logo */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 shrink-0">
          <div className="flex items-center gap-2.5 group">
            <div className={`w-10 h-10 rounded-xl p-0.5 shadow-md group-hover:scale-105 transition-transform ${isHr
                ? 'bg-gradient-to-tr from-purple-700 via-purple-600 to-violet-500 shadow-purple-500/20'
                : isAdmin
                  ? 'bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-500 shadow-indigo-500/20'
                  : 'bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 shadow-teal-500/20'
              }`}>
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className={`w-5 h-5 ${isHr ? 'text-purple-400' : isAdmin ? 'text-indigo-400' : 'text-teal-400'}`} />
              </div>
            </div>
            <div>
              <span className={`text-xl font-extrabold bg-clip-text text-transparent tracking-tight block leading-tight ${isHr
                  ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-purple-400'
                  : isAdmin
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500'
                    : 'bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-400'
                }`}>
                SkillBridge<span className={isHr ? 'text-purple-500 dark:text-purple-400' : isAdmin ? 'text-indigo-500' : 'text-teal-500'}>.AI</span>
              </span>
              <span className={`block text-[10px] font-bold tracking-wider uppercase leading-snug ${isHr ? 'text-purple-600 dark:text-purple-400' : isAdmin ? 'text-indigo-600 dark:text-indigo-400' : 'text-teal-600 dark:text-teal-400'
                }`}>
                {workspaceName}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 group ${isActive
                    ? isHr
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : isAdmin
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                    : isHr
                      ? 'text-slate-600 dark:text-slate-400 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400'
                      : isAdmin
                        ? 'text-slate-600 dark:text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400'
                  }`}
              >
                {item.isLucide ? (
                  <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                ) : (
                  <Icon size={16} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 z-10 bg-slate-100 dark:bg-[#0b1120]">
        {/* Navbar Header */}
        <header className="h-16 px-8 flex justify-between items-center border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900 backdrop-blur-md shrink-0 relative z-50">
          {/* Global Search Bar with Live Command Dropdown */}
          <div className="relative w-80 md:w-96" ref={searchRef}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isAdmin ? "Search system logs, users, pages..." : isHr ? "Search employees, skills, reports..." : "Search skills, courses, careers..."}
              value={globalSearch}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setSearchOpen(true);
              }}
              onKeyDown={handleSearchKeyDown}
              className={`w-full pl-10 pr-8 py-2 text-xs font-medium bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${isHr ? 'focus:ring-purple-500/40' : isAdmin ? 'focus:ring-indigo-500/40' : 'focus:ring-teal-500/40'
                }`}
            />
            {globalSearch && (
              <button
                type="button"
                onClick={() => {
                  setGlobalSearch('');
                  setSearchOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold px-1"
              >
                ✕
              </button>
            )}

            {/* Quick Search Results Dropdown */}
            {searchOpen && globalSearch.trim().length > 0 && (
              <div className="absolute left-0 mt-2 w-full max-h-80 overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Results ({searchResults.length})</span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    No results found for "{globalSearch}"
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/40">
                    {searchResults.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSearchResult(item.path)}
                        className={`p-3 hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer transition-colors flex items-center justify-between gap-3`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                            <span>{item.label}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${isHr
                                ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                                : isAdmin
                                  ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                                  : 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300'
                              }`}>
                              {item.category}
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                        </div>
                        <span className={`text-[10px] font-bold shrink-0 ${isHr ? 'text-purple-600 dark:text-purple-400' : isAdmin ? 'text-indigo-600 dark:text-indigo-400' : 'text-teal-600 dark:text-teal-400'
                          }`}>Open →</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {isDark ? <SunFill size={16} /> : <MoonFill size={16} className={isHr ? "text-purple-600" : isAdmin ? "text-indigo-600" : "text-teal-600"} />}
            </button>

            {/* Notification Bell Button & Blinking Badge */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleToggleNotifBell}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors cursor-pointer relative"
                title="Notifications"
              >
                <BellFill size={16} className="text-slate-700 dark:text-slate-200" />

                {/* Blinking Red Counter Badge */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 text-white text-[10px] font-black items-center justify-center shadow-md">
                      {unreadCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-700/80 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-700/70 flex items-center justify-between">
                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <BellFill size={13} className="text-amber-500" /> Notifications ({unreadCount} new)
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className={`text-[11px] font-bold hover:underline cursor-pointer ${isHr ? 'text-purple-600 dark:text-purple-400' : isAdmin ? 'text-indigo-600 dark:text-indigo-400' : 'text-teal-600 dark:text-teal-400'
                          }`}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleReadNotif(n.id)}
                        className={`p-3 text-xs transition-colors cursor-pointer ${!n.read
                            ? 'bg-teal-50/60 dark:bg-slate-700/40 hover:bg-teal-100/60 dark:hover:bg-slate-700/70'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/30 opacity-75'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-slate-900 dark:text-white leading-snug">{n.title}</p>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1"></span>}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 leading-normal">{n.message}</p>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">{formatRelativeTime(n)}</span>
                      </div>
                    ))}
                  </div>

                  {/* View All Notifications Button */}
                  <div className="pt-2 px-3 border-t border-slate-100 dark:border-slate-700/70 text-center">
                    <button
                      onClick={() => {
                        setNotifOpen(false);
                        navigate(notificationsPath);
                      }}
                      className={`w-full py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${isHr ? 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700/60' : isAdmin ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700/60' : 'text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-700/60'
                        }`}
                    >
                      View All Notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2.5 p-1 rounded-full hover:ring-4 transition-all duration-200 cursor-pointer focus:outline-none ${isHr ? 'hover:ring-purple-500/20' : isAdmin ? 'hover:ring-indigo-500/20' : 'hover:ring-teal-500/20'
                  }`}
              >
                <div className={`w-10 h-10 rounded-full p-0.5 shadow-md ${isHr
                    ? 'bg-gradient-to-r from-purple-500 to-violet-400 shadow-purple-500/20'
                    : isAdmin
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-400 shadow-indigo-500/20'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-400 shadow-teal-500/20'
                  }`}>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-sm font-black ${isHr ? 'text-purple-600 dark:text-purple-400' : isAdmin ? 'text-indigo-600 dark:text-indigo-400' : 'text-teal-600 dark:text-teal-400'
                      }`}>
                      {initialLetter}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden md:inline-block">
                  {user?.name || user?.username || (isAdmin ? 'Marcus Vance' : isHr ? 'Sarah Jenkins' : 'Employee')}
                </span>
                <ChevronDown size={14} className={`text-slate-500 dark:text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-700/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Header */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/70">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                      {user?.name || user?.username || (isAdmin ? 'Marcus Vance' : isHr ? 'Sarah Jenkins' : 'Employee')}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user?.email || (isAdmin ? 'admin@skillbridge.ai' : isHr ? 'hr@skillbridge.ai' : 'employee@skillbridge.ai')}
                    </p>
                  </div>

                  {/* Menu Actions */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(profilePath);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors cursor-pointer text-left ${isHr ? 'hover:text-purple-600 dark:hover:text-purple-400' : isAdmin ? 'hover:text-indigo-600 dark:hover:text-indigo-400' : 'hover:text-teal-600 dark:hover:text-teal-400'
                        }`}
                    >
                      <PersonFill size={15} className={isHr ? 'text-purple-500' : isAdmin ? 'text-indigo-500' : 'text-teal-500'} />
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(settingsPath);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors cursor-pointer text-left ${isHr ? 'hover:text-purple-600 dark:hover:text-purple-400' : isAdmin ? 'hover:text-indigo-600 dark:hover:text-indigo-400' : 'hover:text-teal-600 dark:hover:text-teal-400'
                        }`}
                    >
                      <GearFill size={15} className={isHr ? 'text-purple-500' : isAdmin ? 'text-indigo-500' : 'text-teal-500'} />
                      Settings
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
                    >
                      <BoxArrowRight size={15} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto bg-slate-100 dark:bg-[#0b1120]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;