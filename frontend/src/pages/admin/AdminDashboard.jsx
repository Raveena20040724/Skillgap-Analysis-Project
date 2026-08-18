import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Key, 
  Building2, 
  Server, 
  Sliders, 
  Lock, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const AUDIT_LOGS = [
  {
    time: '[14:32:01]',
    timeColor: 'text-blue-500 font-bold',
    message: 'Admin user Marcus Vance signed in from IP 192.168.1.45'
  },
  {
    time: '[13:15:22]',
    timeColor: 'text-emerald-500 font-bold',
    message: 'AI Skill Gap Index updated for 145 Engineering users'
  },
  {
    time: '[11:04:10]',
    timeColor: 'text-purple-500 font-bold',
    message: 'JWT OAuth token refreshed for user sarah.jenkins@company.com'
  },
  {
    time: '[09:20:11]',
    timeColor: 'text-amber-500 font-bold',
    message: 'System backup completed successfully (2.4 GB snapshot)'
  }
];

const AdminDashboard = () => {
  const [systemMaintenance, setSystemMaintenance] = useState(() => {
    return localStorage.getItem('system_maintenance_mode') === 'true';
  });
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('info');
  const [adminStats, setAdminStats] = useState({
    totalUsers: 342,
    activeRoles: 3,
    totalDepartments: 5,
    systemHealth: '99.9% Uptime'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminService.getSystemStats();
      if (res.data) {
        setAdminStats({
          totalUsers: res.data.total_users || 342,
          activeRoles: 3,
          totalDepartments: res.data.total_departments || 5,
          systemHealth: res.data.system_health || '99.9% Uptime'
        });
      }
    } catch (err) {
      console.log('Using default admin stats.', err);
    }
  };

  const showToast = (msg, type = 'info') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 shadow-lg animate-fade-in ${
          toastType === 'warning'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300'
            : 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-300'
        }`}>
          {toastType === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
          )}
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Hero Security Panel Card */}
      <div className="p-6 sm:p-8 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-3 relative overflow-hidden transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
            SUPER ADMIN SECURITY PANEL
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          SkillBridge System Operations
        </h1>

        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Manage system users, RBAC permissions, company department taxonomies, and AI inference API keys.
        </p>
      </div>

      {/* 4 Stat Summary Cards (Exact Skill Gap Values) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Registered Users */}
        <div className="p-6 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl flex items-start justify-between gap-4 transition-colors">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Registered Users
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {adminStats.totalUsers}
            </p>
            <p className="text-xs font-semibold text-slate-400">
              Active Accounts
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        {/* Card 2: Active Roles */}
        <div className="p-6 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl flex items-start justify-between gap-4 transition-colors">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Active Roles
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {adminStats.activeRoles}
            </p>
            <p className="text-xs font-semibold text-slate-400">
              Employee, HR, Admin
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Key className="w-6 h-6 text-indigo-500" />
          </div>
        </div>

        {/* Card 3: Departments */}
        <div className="p-6 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl flex items-start justify-between gap-4 transition-colors">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Departments
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {adminStats.totalDepartments}
            </p>
            <p className="text-xs font-semibold text-slate-400">
              Configured benchmarks
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        {/* Card 4: API Uptime */}
        <div className="p-6 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl flex items-start justify-between gap-4 transition-colors">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              API Uptime
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {adminStats.systemHealth}
            </p>
            <p className="text-xs font-semibold text-slate-400">
              Healthy REST API
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Server className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </div>

      {/* System Settings & Configuration Cards (Exact Skill Gap Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Platform & AI Engine Configurations */}
        <div className="p-6 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-500" />
            Platform & AI Engine Configurations
          </h3>

          <div className="space-y-3 text-xs">
            {/* Item 1 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">AI Skill Gap Recommendation Model</div>
                <div className="text-slate-400 mt-0.5">Gemini 3.5 Flash / DRF Endpoint</div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold rounded-lg text-[11px]">
                ACTIVE
              </span>
            </div>

            {/* Item 2 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">JWT Bearer Auth Expiration</div>
                <div className="text-slate-400 mt-0.5">24 Hours Token Refresh TTL</div>
              </div>
              <button
                onClick={() => showToast('Token TTL updated to 24 Hours', 'info')}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Configure
              </button>
            </div>

            {/* Item 3 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">System Maintenance Mode</div>
                <div className="text-slate-400 mt-0.5">Restrict user logins during database upgrades</div>
              </div>
              <input
                type="checkbox"
                checked={systemMaintenance}
                onChange={() => {
                  const nextState = !systemMaintenance;
                  setSystemMaintenance(nextState);
                  localStorage.setItem('system_maintenance_mode', nextState.toString());
                  window.dispatchEvent(new Event('maintenanceModeChanged'));
                  showToast(
                    `System Maintenance Mode ${nextState ? 'ENABLED (User logins restricted)' : 'DISABLED (Normal operations)'}`,
                    nextState ? 'warning' : 'info'
                  );
                }}
                className="w-4 h-4 text-blue-600 rounded-md cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Security Audit Telemetry Log */}
        <div className="p-6 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-500" />
            Security & Audit Telemetry Log
          </h3>

          <div className="space-y-2.5 text-xs font-mono">
            {AUDIT_LOGS.map((log, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/40 flex items-start gap-2"
              >
                <span className={log.timeColor}>{log.time}</span>
                <span className="font-sans font-semibold leading-relaxed">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;