import { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Trash2, 
  Filter, 
  Sparkles, 
  BookOpen, 
  Award, 
  FileText, 
  ChevronRight,
  Zap,
  CheckCheck,
  X
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    title: 'AI Skill Gap Analysis Ready',
    message: 'Your latest skill assessment has been processed by AI telemetry. 4 skill gaps identified for Senior Frontend Developer role.',
    category: 'Skill Gap & AI',
    time: '10 minutes ago',
    date: '2026-08-07',
    read: false,
    type: 'ai',
    link: ROUTES.SKILL_GAP_RESULTS,
    actionLabel: 'View Skill Gap Results',
  },
  {
    id: '2',
    title: 'New Recommended Course Added',
    message: 'Advanced React Design Systems & Micro-frontends course added to your personalized learning pathway.',
    category: 'Courses & Path',
    time: '1 hour ago',
    date: '2026-08-07',
    read: false,
    type: 'course',
    link: ROUTES.COURSE_RECOMMENDATIONS,
    actionLabel: 'Explore Courses',
  },
  {
    id: '3',
    title: 'Resume Successfully Parsed',
    message: 'CV telemetry updated. 8 technical skills extracted and automatically synced into your live profile.',
    category: 'Skill Gap & AI',
    time: '2 hours ago',
    date: '2026-08-07',
    read: false,
    type: 'resume',
    link: ROUTES.RESUME_UPLOAD,
    actionLabel: 'View Active Resume',
  },
  {
    id: '4',
    title: 'Quarterly Assessment Due',
    message: 'Frontend Architecture & State Management assessment is scheduled for completion before Aug 15.',
    category: 'Assessments',
    time: 'Yesterday at 4:30 PM',
    date: '2026-08-06',
    read: true,
    type: 'assessment',
    link: ROUTES.SKILL_ASSESSMENT,
    actionLabel: 'Take Assessment',
  },
  {
    id: '5',
    title: 'Career Match Score Increase (+12%)',
    message: 'Congratulations! Your profile match score for Senior Web Architect role increased from 74% to 86%.',
    category: 'Skill Gap & AI',
    time: '2 days ago',
    date: '2026-08-05',
    read: true,
    type: 'career',
    link: ROUTES.CAREER_RECOMMENDATIONS,
    actionLabel: 'View Career Path',
  },
  {
    id: '6',
    title: 'Learning Milestone Reached',
    message: 'You have completed 75% of your React & TypeScript mastery roadmap!',
    category: 'Courses & Path',
    time: '3 days ago',
    date: '2026-08-04',
    read: true,
    type: 'course',
    link: ROUTES.LEARNING_PATH,
    actionLabel: 'View Learning Path',
  },
];

const CATEGORIES = ['All', 'Unread', 'Skill Gap & AI', 'Courses & Path', 'Assessments'];

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('employee_alerts_list');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [bannerMsg, setBannerMsg] = useState('');

  // Automatically mark all unread notifications as read when opening the Notifications page
  useEffect(() => {
    setNotifications((prev) => {
      const allRead = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem('employee_alerts_list', JSON.stringify(allRead));
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
    localStorage.setItem('employee_alerts_list', JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
    showBanner('All notifications marked as read.');
  };

  const handleClearAll = () => {
    setNotifications([]);
    localStorage.setItem('employee_alerts_list', JSON.stringify([]));
    window.dispatchEvent(new Event('notificationsUpdated'));
    showBanner('Notification inbox cleared.');
  };

  const handleToggleRead = (id, e) => {
    e.stopPropagation();
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
    setNotifications(updated);
    localStorage.setItem('employee_alerts_list', JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('employee_alerts_list', JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
    if (selectedNotification?.id === id) setSelectedNotification(null);
    showBanner('Notification removed.');
  };

  const handleNotificationClick = (item) => {
    const updated = notifications.map((n) => (n.id === item.id ? { ...n, read: true } : n));
    setNotifications(updated);
    localStorage.setItem('employee_alerts_list', JSON.stringify(updated));
    window.dispatchEvent(new Event('notificationsUpdated'));
    setSelectedNotification(item);
  };

  // Filtered list
  const filteredNotifications = notifications.filter((item) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Unread') return !item.read;
    return item.category === activeCategory;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'ai':
      case 'career':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'course':
        return <BookOpen className="w-5 h-5 text-teal-500" />;
      case 'assessment':
        return <Award className="w-5 h-5 text-indigo-500" />;
      case 'resume':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-teal-500" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600/10 via-teal-600/10 to-indigo-600/10 dark:from-blue-500/20 dark:via-teal-500/20 dark:to-indigo-500/20 p-6 rounded-2xl border border-blue-500/20 dark:border-blue-500/30">
        <div>
          <PageHeader
            title={
              <span className="flex items-center gap-2.5 text-slate-900 dark:text-white font-extrabold text-2xl">
                <Bell className="w-7 h-7 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
                Notifications Center
              </span>
            }
            subtitle="Stay updated on AI skill gap insights, learning pathways, assessment deadlines, and platform telemetry."
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
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
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-2 py-0.2 rounded-full text-[10px] ${
                    activeCategory === cat
                      ? 'bg-blue-700 text-blue-100'
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
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-slate-300 dark:border-slate-800">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No notifications found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                You are all caught up! There are no notifications in "{activeCategory}".
              </p>
            </div>
          </Card>
        ) : (
          filteredNotifications.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-5 border transition-all duration-200 cursor-pointer group hover:border-blue-500/50 ${
                !item.read
                  ? 'bg-white dark:bg-slate-900/90 border-blue-500/30 dark:border-blue-500/40 shadow-md'
                  : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 opacity-85'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Category Icon Badge */}
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shrink-0">
                    {getIcon(item.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {item.category}
                      </span>
                      {!item.read && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-500 text-white animate-pulse">
                          NEW
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-slate-400">
                        {item.time}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {item.link && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(item.link);
                      }}
                      className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white dark:text-blue-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{item.actionLabel || 'View Detail'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={(e) => handleToggleRead(item.id, e)}
                    title={item.read ? 'Mark as Unread' : 'Mark as Read'}
                    className="p-2 rounded-xl text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <CheckCheck className={`w-4 h-4 ${item.read ? 'text-teal-500' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    title="Delete Notification"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Selected Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 rounded-xl">
                  {getIcon(selectedNotification.type)}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">
                    {selectedNotification.category}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                    {selectedNotification.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedNotification(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedNotification.message}
              </p>

              <p className="text-[11px] font-semibold text-slate-400">
                Received: {selectedNotification.time} ({selectedNotification.date})
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                onClick={() => setSelectedNotification(null)}
              >
                Close
              </Button>
              {selectedNotification.link && (
                <Button
                  variant="primary"
                  onClick={() => {
                    const targetLink = selectedNotification.link;
                    setSelectedNotification(null);
                    navigate(targetLink);
                  }}
                >
                  {selectedNotification.actionLabel || 'Navigate To Page'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
