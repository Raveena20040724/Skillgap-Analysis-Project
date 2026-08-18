import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../constants/routes';
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
  Sliders 
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const dropdownRef = useRef(null);
  const portalRef = useRef(null);
  const notifRef = useRef(null);

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
    ? ROUTES.ADMIN_DASHBOARD 
    : isHr 
    ? ROUTES.HR_DIRECTORY 
    : ROUTES.EMPLOYEE_PROFILE;

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
      ];
    }

    if (isHr) {
      return [
        { label: 'HR Dashboard', path: ROUTES.HR_DASHBOARD, icon: LayoutGrid, isLucide: true },
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
        const saved = localStorage.getItem(notifStorageKey);
        if (saved) {
          setNotifications(JSON.parse(saved));
        } else {
          setNotifications(getInitialNotifications());
        }
      } catch {
        setNotifications(getInitialNotifications());
      }
    };

    syncNotifs();
    window.addEventListener('notificationsUpdated', syncNotifs);
    return () => window.removeEventListener('notificationsUpdated', syncNotifs);
  }, [location.pathname, notifStorageKey]);

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
    localStorage.setItem(notifStorageKey, JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
  };

  const handleToggleNotifBell = () => {
    const nextOpen = !notifOpen;
    setNotifOpen(nextOpen);
    if (nextOpen && unreadCount > 0) {
      // Touching/opening notification bell marks all unread as read
      markAllAsRead();
    }
  };

  const handleReadNotif = (id) => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(notifStorageKey, JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
    setNotifOpen(false);
    navigate(notificationsPath);
  };

  const initialLetter = (user?.name || user?.username || 'Employee').charAt(0).toUpperCase();

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-100 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar - Fixed full height */}
      <aside className="w-64 h-full bg-white dark:bg-[#161f33] border-r border-slate-200 dark:border-slate-800/80 flex flex-col shrink-0 shadow-lg dark:shadow-none z-20 overflow-y-auto">
        {/* Brand Header with Exact SkillBridge.AI Logo */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 shrink-0">
          <div className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent tracking-tight block leading-tight">
                SkillBridge<span className="text-blue-600 dark:text-emerald-400">.AI</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase leading-snug">
                SKILL GAP & CAREER PLATFORM
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
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-white'
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
          {/* Global Search Bar (Center/Left) */}
          <div className="relative w-80 md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isAdmin ? "Search system logs, users..." : isHr ? "Search employees, skills..." : "Search skills, courses, careers..."}
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {isDark ? <SunFill size={16} /> : <MoonFill size={16} className="text-blue-600" />}
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
                        className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
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
                        className={`p-3 text-xs transition-colors cursor-pointer ${
                          !n.read 
                            ? 'bg-blue-50/60 dark:bg-slate-700/40 hover:bg-blue-100/60 dark:hover:bg-slate-700/70' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/30 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-slate-900 dark:text-white leading-snug">{n.title}</p>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1"></span>}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 leading-normal">{n.message}</p>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">{n.time}</span>
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
                      className="w-full py-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-700/60 rounded-xl transition-colors cursor-pointer"
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
                className="flex items-center gap-2.5 p-1 rounded-full hover:ring-4 hover:ring-teal-500/10 transition-all duration-200 cursor-pointer focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 p-0.5 shadow-md shadow-teal-500/20">
                  {user?.avatar || localStorage.getItem('userAvatar') ? (
                    <img 
                      src={user?.avatar || localStorage.getItem('userAvatar')} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-sm font-black text-blue-600 dark:text-teal-400">
                      {initialLetter}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden md:inline-block">
                  {user?.name || (isAdmin ? 'Marcus Vance' : isHr ? 'Sarah Jenkins' : 'Alex Morgan')}
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
                      {user?.name || (isAdmin ? 'Marcus Vance' : isHr ? 'Sarah Jenkins' : 'Alex Morgan')}
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
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                    >
                      <PersonFill size={15} className="text-teal-500" />
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(settingsPath);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                    >
                      <GearFill size={15} className="text-blue-500" />
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