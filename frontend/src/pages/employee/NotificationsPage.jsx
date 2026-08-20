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
  ShieldCheck, 
  AlertCircle, 
  Layers,
  X
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { showGlobalToast } from '../../components/common/ToastContainer';
import { getUserData, setUserData, getActiveUser } from '../../utils/userStorage';

const CATEGORIES = ['All', 'Unread', 'Skill Growth', 'Resume Processing', 'Skill Assessment', 'Courses & Path'];

const NotificationsPage = () => {
  const navigate = useNavigate();
  const activeUser = getActiveUser();

  const getInitialUserAlerts = () => {
    const saved = getUserData('alerts_list', null);
    if (saved !== null) return saved;

    // Fallback single welcome alert if no alerts exist
    return [
      {
        id: `notif_${Date.now()}`,
        title: `Welcome to SkillGap, ${activeUser?.name || activeUser?.username || 'Employee'}!`,
        message: 'Your account is ready. Get started by uploading your resume or taking your first AI skill assessment to diagnose skill gaps and explore career paths.',
        category: 'Skill Growth',
        time: 'Just now',
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'welcome',
        link: ROUTES.RESUME_UPLOAD,
        actionLabel: 'Upload Resume'
      }
    ];
  };

  const [notifications, setNotifications] = useState(getInitialUserAlerts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isClearAllConfirmOpen, setIsClearAllConfirmOpen] = useState(false);
  const [bannerMsg, setBannerMsg] = useState('');

  // Automatically mark all unread notifications as read when opening the Notifications page
  useEffect(() => {
    const current = getUserData('alerts_list', null);
    if (current && Array.isArray(current) && current.length > 0) {
      const hasUnread = current.some(n => !n.read);
      if (hasUnread) {
        const allRead = current.map((n) => ({ ...n, read: true }));
        setNotifications(allRead);
        setUserData('alerts_list', allRead);
        window.dispatchEvent(new Event('notificationsUpdated'));
      } else {
        setNotifications(current);
      }
    } else {
      const initial = getInitialUserAlerts();
      setNotifications(initial);
      setUserData('alerts_list', initial);
    }

    const handleExternalUpdate = () => {
      const updated = getUserData('alerts_list', null);
      if (updated && Array.isArray(updated)) {
        setNotifications(updated);
      }
    };

    window.addEventListener('userDataChanged', handleExternalUpdate);
    return () => window.removeEventListener('userDataChanged', handleExternalUpdate);
  }, []);

  const showBanner = (msg) => {
    setBannerMsg(msg);
    setTimeout(() => setBannerMsg(''), 3000);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    setUserData('alerts_list', updated);
    window.dispatchEvent(new Event('notificationsUpdated'));
    showGlobalToast('All notifications marked as read.', 'success');
  };

  const handleDeleteClick = (n, e) => {
    e.stopPropagation();
    setItemToDelete(n);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const updated = notifications.filter((n) => n.id !== itemToDelete.id);
    setNotifications(updated);
    setUserData('alerts_list', updated);
    window.dispatchEvent(new Event('notificationsUpdated'));
    showGlobalToast(`Notification deleted.`, 'delete');
    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
    if (selectedNotification?.id === itemToDelete.id) {
      setSelectedNotification(null);
    }
  };

  const handleClearAll = () => {
    setNotifications([]);
    setUserData('alerts_list', []);
    window.dispatchEvent(new Event('notificationsUpdated'));
    setSelectedNotification(null);
    showGlobalToast('Cleared all notifications.', 'delete');
    setIsClearAllConfirmOpen(false);
  };

  const handleNotificationClick = (n) => {
    const updated = notifications.map((item) => (item.id === n.id ? { ...item, read: true } : item));
    setNotifications(updated);
    setUserData('alerts_list', updated);
    window.dispatchEvent(new Event('notificationsUpdated'));
    setSelectedNotification({ ...n, read: true });
  };

  const handleActionClick = (n) => {
    if (n.link) {
      const updated = notifications.map((item) => (item.id === n.id ? { ...item, read: true } : item));
      setNotifications(updated);
      setUserData('alerts_list', updated);
      window.dispatchEvent(new Event('notificationsUpdated'));
      navigate(n.link);
    }
  };

  // Filtered list
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const filteredNotifications = safeNotifications.filter((item) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Unread') return !item.read;
    return item.category === activeCategory;
  });

  const unreadCount = safeNotifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'ai':
      case 'career':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'course':
        return <BookOpen className="w-5 h-5 text-emerald-500" />;
      case 'assessment':
        return <Award className="w-5 h-5 text-indigo-500" />;
      case 'resume':
        return <FileText className="w-5 h-5 text-teal-500" />;
      default:
        return <Bell className="w-5 h-5 text-teal-500" />;
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
            Notifications Center
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Stay up to date with skill assessments, AI gap recommendations, and curriculum milestones.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 dark:bg-white/10 dark:hover:bg-white/20 text-teal-700 dark:text-teal-200 border border-teal-200 dark:border-teal-400/30 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <CheckCheck className="w-4 h-4 text-teal-600 dark:text-teal-300" />
              <span>Mark All Read</span>
            </button>
          )}

          {safeNotifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-400/30 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Banner Feedback */}
      {bannerMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700/60 text-teal-800 dark:text-teal-200 rounded-xl text-sm font-semibold shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
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
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-2 py-0.2 rounded-full text-[10px] ${
                    activeCategory === cat
                      ? 'bg-teal-700 text-teal-100'
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
              className={`p-5 border transition-all duration-200 cursor-pointer group hover:border-teal-500/50 ${
                !item.read
                  ? 'bg-white dark:bg-slate-900/90 border-teal-500/30 dark:border-teal-500/40 shadow-md'
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
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
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

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
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
                      className="px-4 py-2 bg-teal-600/10 hover:bg-teal-600 text-teal-600 hover:text-white dark:text-teal-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{item.actionLabel || 'View Detail'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={(e) => handleDeleteClick(item, e)}
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
                <div className="p-2.5 bg-teal-500/10 rounded-xl">
                  {getIcon(selectedNotification.type)}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-teal-600 dark:text-teal-400">
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

      {/* Delete Notification Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Delete Notification"
        message={`Are you sure you want to delete this notification "${itemToDelete?.title || 'Selected Alert'}"?`}
        confirmText="Yes, Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setItemToDelete(null);
        }}
      />

      {/* Clear All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isClearAllConfirmOpen}
        title="Clear All Notifications"
        message="Are you sure you want to remove all notifications from your inbox?"
        confirmText="Clear All"
        onConfirm={handleClearAll}
        onCancel={() => setIsClearAllConfirmOpen(false)}
      />
    </div>
  );
};

export default NotificationsPage;
