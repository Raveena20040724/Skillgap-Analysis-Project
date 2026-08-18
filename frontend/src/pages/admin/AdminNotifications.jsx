import { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Trash2, 
  ChevronRight,
  Zap,
  CheckCheck,
  X,
  Users,
  ShieldCheck,
  Sliders,
  Database,
  Activity,
  AlertOctagon,
  ArrowRight,
  Server,
  KeyRound,
  FileCode2
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const INITIAL_ADMIN_NOTIFICATIONS = [
  {
    id: 'adm-1',
    title: 'PostgreSQL Database Synced & Healthy',
    message: 'Primary database "skillgap_app_db" successfully connected. All 12 application schemas and active migrations verified.',
    category: 'System & Database',
    time: '10 minutes ago',
    date: '2026-08-13',
    read: false,
    type: 'database',
    severity: 'info',
    link: ROUTES.ADMIN_SETTINGS,
    actionLabel: 'View System Settings',
    metadata: {
      dbName: 'skillgap_app_db',
      dbEngine: 'PostgreSQL 16.x',
      latency: '1.2ms',
      status: 'ONLINE',
    }
  },
  {
    id: 'adm-2',
    title: 'New HR Manager Account Created',
    message: 'HR Manager profile "Sarah Jenkins (sarah.jenkins@company.com)" provisioned with HR Directory and Reports access.',
    category: 'User Management',
    time: '45 minutes ago',
    date: '2026-08-13',
    read: false,
    type: 'user',
    severity: 'success',
    link: ROUTES.ADMIN_USERS,
    actionLabel: 'Manage User Accounts',
    metadata: {
      user: 'sarah.jenkins@company.com',
      assignedRole: 'HR Manager',
      department: 'Human Resources',
    }
  },
  {
    id: 'adm-3',
    title: 'Security Audit: Role Permissions Updated',
    message: 'Global permission matrix for Role "HR Manager" modified. Added permission: Read Employee Telemetry.',
    category: 'Security & Access',
    time: '2 hours ago',
    date: '2026-08-13',
    read: false,
    type: 'security',
    severity: 'warning',
    link: ROUTES.ADMIN_ROLES,
    actionLabel: 'Review Roles & Permissions',
    metadata: {
      modifiedBy: 'System Administrator',
      targetRole: 'HR Manager',
      scope: 'Global Read Permissions',
    }
  },
  {
    id: 'adm-4',
    title: 'High API Throughput & 99.99% Uptime',
    message: 'SkillGap AI backend engine processed 2,400+ request cycles with average response latency of 28ms.',
    category: 'System & Database',
    time: 'Yesterday at 9:00 PM',
    date: '2026-08-12',
    read: true,
    type: 'telemetry',
    severity: 'info',
    link: ROUTES.ADMIN_REPORTS,
    actionLabel: 'Open System Reports',
    metadata: {
      requestsProcessed: '2,480',
      avgLatency: '28ms',
      errorRate: '0.00%',
    }
  },
  {
    id: 'adm-5',
    title: 'New Department Registered',
    message: 'Department "AI & Machine Learning Research" added by Admin. Initial workforce allocation enabled.',
    category: 'User Management',
    time: '2 days ago',
    date: '2026-08-11',
    read: true,
    type: 'department',
    severity: 'info',
    link: ROUTES.ADMIN_DEPARTMENTS,
    actionLabel: 'Manage Departments',
    metadata: {
      department: 'AI & Machine Learning Research',
      code: 'AIML-01',
      headcount: 0,
    }
  },
  {
    id: 'adm-6',
    title: 'JWT Secret Key & CORS Configuration Validated',
    message: 'Application runtime confirmed secure origin bindings for localhost:5173 with active JWT bearer auth.',
    category: 'Security & Access',
    time: '3 days ago',
    date: '2026-08-10',
    read: true,
    type: 'security',
    severity: 'info',
    link: ROUTES.ADMIN_SETTINGS,
    actionLabel: 'Inspect Environment',
    metadata: {
      allowedOrigins: 'http://localhost:5173',
      tokenLifecycle: 'Access: 1d / Refresh: 7d',
    }
  },
];

const CATEGORIES = ['All', 'Unread', 'System & Database', 'Security & Access', 'User Management'];

const AdminNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_alerts_list');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_NOTIFICATIONS;
    } catch {
      return INITIAL_ADMIN_NOTIFICATIONS;
    }
  });
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [bannerMsg, setBannerMsg] = useState('');

  // Automatically mark all unread notifications as read when opening the System Alerts page
  useEffect(() => {
    setNotifications((prev) => {
      const allRead = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem('admin_alerts_list', JSON.stringify(allRead));
      window.dispatchEvent(new Event('notificationsUpdated'));
      return allRead;
    });
  }, []);

  const showBanner = (msg) => {
    setBannerMsg(msg);
    setTimeout(() => setBannerMsg(''), 3000);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('admin_alerts_list', JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
    showBanner('All administrator notifications marked as read.');
  };

  const handleClearAll = () => {
    setNotifications([]);
    localStorage.setItem('admin_alerts_list', JSON.stringify([]));
    window.dispatchEvent(new Event('notificationsUpdated'));
    showBanner('Admin notification inbox cleared.');
  };

  const handleToggleRead = (id, e) => {
    e.stopPropagation();
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
    setNotifications(updated);
    localStorage.setItem('admin_alerts_list', JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('admin_alerts_list', JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
    if (selectedNotification?.id === id) setSelectedNotification(null);
    showBanner('Notification item removed.');
  };

  const handleNotificationClick = (item) => {
    const updated = notifications.map((n) => (n.id === item.id ? { ...n, read: true } : n));
    setNotifications(updated);
    localStorage.setItem('admin_alerts_list', JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
    setSelectedNotification(item);
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((item) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Unread') return !item.read;
    return item.category === activeCategory;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'database':
        return <Database className="w-5 h-5 text-blue-500" />;
      case 'security':
        return <ShieldCheck className="w-5 h-5 text-rose-500" />;
      case 'user':
      case 'department':
        return <Users className="w-5 h-5 text-teal-500" />;
      case 'telemetry':
        return <Activity className="w-5 h-5 text-emerald-500" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 rounded-2xl border border-indigo-500/20 text-white shadow-xl">
        <div>
          <PageHeader
            title={
              <span className="flex items-center gap-2.5 text-white font-extrabold text-2xl">
                <Bell className="w-7 h-7 text-indigo-400 stroke-[2.2]" />
                System Administration Alerts
              </span>
            }
            subtitle="Central audit log, database synchronizations, security incidents, user creation events, and system telemetry."
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-indigo-200 border border-indigo-400/30 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Banner Feedback */}
      {bannerMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-200 rounded-xl text-sm font-semibold shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          {bannerMsg}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/70 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unread Alerts</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{unreadCount}</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/70 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Database Status</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">Online (PostgreSQL)</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/70 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">System Health</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">99.99% Uptime</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs Toolbar */}
      <Card className="p-4 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none [scrollbar-width:none]">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? notifications.length
                : cat === 'Unread'
                ? unreadCount
                : notifications.filter((n) => n.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeCategory === cat
                      ? 'bg-indigo-700 text-indigo-100'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No administrative notifications</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              System is operating optimally. No logs matching category "{activeCategory}".
            </p>
          </Card>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 md:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !item.read
                  ? 'bg-white dark:bg-slate-800/95 border-indigo-500/40 dark:border-indigo-500/30 shadow-md shadow-indigo-500/5'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 opacity-85 hover:opacity-100'
              } hover:border-indigo-500/60 hover:shadow-lg`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                    !item.read
                      ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                      : 'bg-slate-200/70 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {getIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                      {item.category}
                    </span>
                    {!item.read && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-sm">
                        New
                      </span>
                    )}
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {item.time}
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    {item.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {item.link && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(item.link);
                    }}
                    className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>{item.actionLabel || 'Manage'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={(e) => handleToggleRead(item.id, e)}
                  className={`p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    item.read
                      ? 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700'
                      : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700'
                  }`}
                  title={item.read ? 'Mark as Unread' : 'Mark as Read'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Delete Notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 md:p-8 space-y-6 relative animate-scale-up">
            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                {getIcon(selectedNotification.type)}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full">
                  {selectedNotification.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {selectedNotification.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedNotification.message}
            </p>

            {/* Metadata Preview */}
            {selectedNotification.metadata && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4 text-indigo-500" />
                  System Audit Payload
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedNotification.metadata).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px]">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
              <span>Timestamp: {selectedNotification.time} ({selectedNotification.date})</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
              {selectedNotification.link && (
                <button
                  onClick={() => {
                    const link = selectedNotification.link;
                    setSelectedNotification(null);
                    navigate(link);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{selectedNotification.actionLabel || 'Inspect'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
