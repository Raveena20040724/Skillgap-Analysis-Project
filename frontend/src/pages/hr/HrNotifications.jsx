import { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Trash2, 
  Award, 
  FileText, 
  ChevronRight,
  Zap,
  CheckCheck,
  X,
  Users,
  PieChart,
  GraduationCap,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Building2
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const INITIAL_HR_NOTIFICATIONS = [
  {
    id: 'hr-1',
    title: 'Employee Assessment Completed',
    message: 'Alex Morgan scored 94% on the Advanced React & State Architecture assessment. Profile competency updated automatically.',
    category: 'Assessments',
    time: '15 minutes ago',
    date: '2026-08-13',
    read: false,
    type: 'assessment',
    priority: 'high',
    link: ROUTES.HR_DIRECTORY,
    actionLabel: 'View Employee Profile',
    metadata: {
      employee: 'Alex Morgan',
      score: '94%',
      department: 'Engineering',
    }
  },
  {
    id: 'hr-2',
    title: 'Department Skill Gap Alert',
    message: 'Engineering department has a 38% critical gap in Cloud & Kubernetes architecture. Recommended training path generated.',
    category: 'Skill Gap Alerts',
    time: '1 hour ago',
    date: '2026-08-13',
    read: false,
    type: 'gap_alert',
    priority: 'high',
    link: ROUTES.HR_REPORTS,
    actionLabel: 'View Skill Gap Report',
    metadata: {
      department: 'Engineering',
      gapSkill: 'Cloud & Kubernetes Architecture',
      affectedUsers: 14,
    }
  },
  {
    id: 'hr-3',
    title: 'New Resume Synced to Directory',
    message: 'Sarah Jenkins synced 8 extracted technical competencies for newly onboarded developer Marcus Chen.',
    category: 'Resumes & Profiles',
    time: '3 hours ago',
    date: '2026-08-13',
    read: false,
    type: 'resume',
    priority: 'medium',
    link: ROUTES.HR_DIRECTORY,
    actionLabel: 'Open Employee Directory',
    metadata: {
      employee: 'Marcus Chen',
      skillsExtracted: 8,
      status: 'Ready for Review',
    }
  },
  {
    id: 'hr-4',
    title: 'Training Pathway Milestone',
    message: '12 employees in Product & Design finished the UI/UX Micro-frontend course. Department average score rose by +14%.',
    category: 'Training & Courses',
    time: 'Yesterday at 5:15 PM',
    date: '2026-08-12',
    read: true,
    type: 'training',
    priority: 'medium',
    link: ROUTES.HR_REPORTS,
    actionLabel: 'Inspect Department Analytics',
    metadata: {
      course: 'UI/UX Micro-frontend Mastery',
      cohortSize: 12,
      impact: '+14% Competency Gain',
    }
  },
  {
    id: 'hr-5',
    title: 'Quarterly Appraisal Cycle Notice',
    message: 'Q3 Skill Verification & Benchmark evaluations are open for 42 team members. 89% of self-assessments completed.',
    category: 'Assessments',
    time: '2 days ago',
    date: '2026-08-11',
    read: true,
    type: 'appraisal',
    priority: 'low',
    link: ROUTES.HR_DIRECTORY,
    actionLabel: 'Track Verification Status',
    metadata: {
      completionRate: '89%',
      pendingReview: 5,
    }
  },
  {
    id: 'hr-6',
    title: 'Executive Workforce Telemetry Ready',
    message: 'Monthly talent distribution and competency matrix report has been compiled and is ready for export.',
    category: 'Skill Gap Alerts',
    time: '3 days ago',
    date: '2026-08-10',
    read: true,
    type: 'report',
    priority: 'low',
    link: ROUTES.HR_REPORTS,
    actionLabel: 'Export HR Report',
    metadata: {
      exportFormat: 'PDF & CSV',
      period: 'August 2026',
    }
  },
];

const CATEGORIES = ['All', 'Unread', 'Assessments', 'Skill Gap Alerts', 'Resumes & Profiles', 'Training & Courses'];

const HrNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('hr_alerts_list');
      return saved ? JSON.parse(saved) : INITIAL_HR_NOTIFICATIONS;
    } catch {
      return INITIAL_HR_NOTIFICATIONS;
    }
  });
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [bannerMsg, setBannerMsg] = useState('');

  // Automatically mark all unread notifications as read when opening HR Notifications
  useEffect(() => {
    setNotifications((prev) => {
      const allRead = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem('hr_alerts_list', JSON.stringify(allRead));
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
    localStorage.setItem('hr_alerts_list', JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
    showBanner('All HR notifications marked as read.');
  };

  const handleClearAll = () => {
    setNotifications([]);
    localStorage.setItem('hr_alerts_list', JSON.stringify([]));
    window.dispatchEvent(new Event('notificationsUpdated'));
    showBanner('HR notification inbox cleared.');
  };

  const handleToggleRead = (id, e) => {
    e.stopPropagation();
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
    setNotifications(updated);
    localStorage.setItem('hr_alerts_list', JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('hr_alerts_list', JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
    if (selectedNotification?.id === id) setSelectedNotification(null);
    showBanner('HR notification removed.');
  };

  const handleNotificationClick = (item) => {
    const updated = notifications.map((n) => (n.id === item.id ? { ...n, read: true } : n));
    setNotifications(updated);
    localStorage.setItem('hr_alerts_list', JSON.stringify(updated));
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
      case 'gap_alert':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'assessment':
      case 'appraisal':
        return <Award className="w-5 h-5 text-purple-500" />;
      case 'training':
        return <GraduationCap className="w-5 h-5 text-teal-500" />;
      case 'resume':
        return <Users className="w-5 h-5 text-indigo-500" />;
      case 'report':
        return <PieChart className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-teal-900/10 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-slate-900 p-6 rounded-2xl border border-purple-500/20 dark:border-purple-500/30">
        <div>
          <PageHeader
            title={
              <span className="flex items-center gap-2.5 text-slate-900 dark:text-white font-extrabold text-2xl">
                <Bell className="w-7 h-7 text-purple-600 dark:text-purple-400 stroke-[2.2]" />
                HR Notification Hub
              </span>
            }
            subtitle="Track employee assessment milestones, workforce skill gaps, training completions, and directory sync updates."
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
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
          <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unread Alerts</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{unreadCount}</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/70 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skill Gap Alerts</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {notifications.filter(n => n.category === 'Skill Gap Alerts').length}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/70 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assessments Pending</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {notifications.filter(n => n.category === 'Assessments').length}
            </p>
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
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeCategory === cat
                      ? 'bg-purple-700 text-purple-100'
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
            <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No HR notifications found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              You are all caught up! There are currently no notifications in "{activeCategory}".
            </p>
          </Card>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 md:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !item.read
                  ? 'bg-white dark:bg-slate-800/95 border-purple-500/40 dark:border-purple-500/30 shadow-md shadow-purple-500/5'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 opacity-85 hover:opacity-100'
              } hover:border-purple-500/60 hover:shadow-lg`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                    !item.read
                      ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'
                      : 'bg-slate-200/70 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {getIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
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
                    className="px-3.5 py-2 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 hover:bg-purple-600 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>{item.actionLabel || 'View'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={(e) => handleToggleRead(item.id, e)}
                  className={`p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    item.read
                      ? 'text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-700'
                      : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700'
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
              <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl">
                {getIcon(selectedNotification.type)}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full">
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

            {/* Metadata Preview if present */}
            {selectedNotification.metadata && (
              <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-purple-100 dark:border-purple-900/40 space-y-2">
                <p className="text-xs font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wider">Event Details</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedNotification.metadata).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
              <span>Received: {selectedNotification.time} ({selectedNotification.date})</span>
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
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{selectedNotification.actionLabel || 'Proceed'}</span>
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

export default HrNotifications;
