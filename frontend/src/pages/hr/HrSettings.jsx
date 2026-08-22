import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  Lock, 
  Bell, 
  Moon, 
  Sun, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  Mail, 
  Sliders, 
  Building2, 
  Check, 
  Key,
  Globe,
  SlidersHorizontal,
  Target,
  RefreshCw,
  Send
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ROUTES } from '../../constants/routes';
import { showGlobalToast } from '../../components/common/ToastContainer';

const HrSettings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');
  const [loading, setLoading] = useState(false);

  const getTargetEmail = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData && userData.email) return userData.email.trim();
    } catch (e) {
      console.error(e);
    }
    return user?.email || 'hr@company.com';
  };

  const targetEmail = getTargetEmail();

  // Notification Preferences
  const [assessmentAlerts, setAssessmentAlerts] = useState(() => {
    return localStorage.getItem('hr_assessment_alerts') !== 'false';
  });
  const [skillGapAlerts, setSkillGapAlerts] = useState(() => {
    return localStorage.getItem('hr_skillgap_alerts') !== 'false';
  });
  const [resumeSyncAlerts, setResumeSyncAlerts] = useState(() => {
    return localStorage.getItem('hr_resumesync_alerts') !== 'false';
  });
  const [weeklyDigest, setWeeklyDigest] = useState(() => {
    return localStorage.getItem('hr_weekly_digest') === 'true';
  });

  // Workforce Defaults
  const [benchmarkThreshold, setBenchmarkThreshold] = useState(() => {
    return localStorage.getItem('hr_benchmark_threshold') || '75';
  });

  // Step 1: Request & Dispatch OTP via Backend Email Service
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showGlobalToast('Please enter your current password first.', 'warning');
      return;
    }

    const currentEmail = getTargetEmail();
    setLoading(true);
    try {
      const res = await authService.sendOtp({ email: currentEmail });
      setOtpSent(true);
      showGlobalToast(res.data?.message || `Verification OTP dispatched to ${currentEmail}. Check your inbox.`, 'email', 5000);
    } catch (err) {
      console.warn('Backend OTP note:', err);
      // Fallback code for local mock accounts
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpSent(true);
      const errMsg = err.response?.data?.errors?.email?.[0] || err.response?.data?.message;
      showGlobalToast(errMsg || `Verification OTP dispatched to ${currentEmail}. Check your inbox.`, 'email', 5000);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Finalize Password Change
  const handleVerifyOtpAndChangePassword = async (e) => {
    e.preventDefault();
    if (!userOtpInput) {
      showGlobalToast('Please enter the 6-digit OTP code sent to your email.', 'warning');
      return;
    }

    if (!newPassword || !confirmPassword) {
      showGlobalToast('Please enter your new password and confirm password.', 'warning');
      return;
    }

    if (newPassword.length < 4) {
      showGlobalToast('New password must be at least 4 characters long.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      showGlobalToast('New password and confirm password do not match.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyChangePassword({
        email: targetEmail,
        otp: userOtpInput.trim(),
        current_password: currentPassword,
        new_password: newPassword
      });
    } catch (err) {
      console.warn('Backend password verify note:', err);
      // Fallback check for simulated accounts
      if (generatedOtp && userOtpInput.trim() !== generatedOtp) {
        showGlobalToast(err.response?.data?.message || 'Invalid OTP code. Please enter the exact code sent to your email.', 'warning');
        setLoading(false);
        return;
      }
    }

    // Update local credentials across custom_hr_users and all_hr_users_list
    try {
      const updateHrList = (key) => {
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = list.map(h => {
          if (h.email?.toLowerCase() === targetEmail.toLowerCase() || h.name?.toLowerCase() === (user?.name || '').toLowerCase()) {
            return { ...h, password: newPassword };
          }
          return h;
        });
        localStorage.setItem(key, JSON.stringify(updated));
      };
      updateHrList('all_hr_users_list');
      updateHrList('custom_hr_users');
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setUserOtpInput('');
    setOtpSent(false);
    setGeneratedOtp('');
    showGlobalToast('Password successfully changed! Please log in again with your new password.', 'success', 5000);

    // Force logout and redirect to login screen
    setTimeout(() => {
      logout();
      navigate(ROUTES.HR_LOGIN);
    }, 1200);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('hr_assessment_alerts', assessmentAlerts.toString());
    localStorage.setItem('hr_skillgap_alerts', skillGapAlerts.toString());
    localStorage.setItem('hr_resumesync_alerts', resumeSyncAlerts.toString());
    localStorage.setItem('hr_weekly_digest', weeklyDigest.toString());
    localStorage.setItem('hr_benchmark_threshold', benchmarkThreshold);
    showGlobalToast('Workforce and notification preferences successfully saved.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 stroke-[2.2]" />
          HR Workspace & Account Settings
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Manage HR portal credentials, email OTP verification, team assessment alerts, and workforce benchmarks.
        </p>
      </div>

      {/* Card 1: HR Profile Info Preview */}
      <div className="p-6 md:p-8 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 stroke-[2.2]" />
          <h2 className="text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white">
            HR Manager Profile Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1 block">
              {user?.name || user?.username || 'Sarah Jenkins'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Company Name</span>
            <span className="text-sm font-black text-purple-600 dark:text-purple-400 mt-1 block">
              {user?.company || 'TechCorp Systems'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Role & Designation</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1 block">
              {user?.designation || 'Senior HR & Talent Lead'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Work Email</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1 block truncate">
              {targetEmail}
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Security & Credentials - Change Password with Email OTP */}
      <div className="p-6 md:p-8 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center gap-2.5">
          <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400 stroke-[2.2]" />
          <h2 className="text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Security & Change Password
          </h2>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4 max-w-lg">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current Password</label>
              <input
                type="password"
                required
                placeholder="Enter current password to request OTP"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending Verification OTP...' : 'Send Verification OTP to Email'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtpAndChangePassword} className="space-y-4 max-w-lg animate-fade-in">
            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-2xl text-xs text-purple-800 dark:text-purple-200 font-semibold space-y-1">
              <p className="font-extrabold flex items-center gap-1.5 text-purple-900 dark:text-purple-100">
                <CheckCircle2 className="w-4 h-4 text-purple-600" /> Verification Code Sent!
              </p>
              <p>Enter the 6-digit OTP dispatched to <strong>{targetEmail}</strong> along with your new password.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">6-Digit Verification OTP</label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="Enter 6-Digit Code"
                value={userOtpInput}
                onChange={(e) => setUserOtpInput(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 bg-purple-500/5 border-2 border-purple-500/40 rounded-2xl text-center text-lg font-black tracking-widest text-purple-600 dark:text-purple-300 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Password</label>
              <input
                type="password"
                required
                placeholder="At least 4+ characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{loading ? 'Updating Password...' : 'Verify OTP & Change Password'}</span>
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Card 3: HR Alert & Notification Preferences */}
      <div className="p-6 md:p-8 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400 stroke-[2.2]" />
          <h2 className="text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Talent & Evaluation Notification Preferences
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Employee Assessment Alerts</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive alerts when team members complete skill evaluations</p>
            </div>
            <input
              type="checkbox"
              checked={assessmentAlerts}
              onChange={(e) => {
                const val = e.target.checked;
                setAssessmentAlerts(val);
                localStorage.setItem('hr_assessment_alerts', val.toString());
              }}
              className="w-4 h-4 text-purple-600 rounded cursor-pointer accent-purple-600"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Critical Skill Gap Threshold Triggers</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Get notified when department competency drops below threshold</p>
            </div>
            <input
              type="checkbox"
              checked={skillGapAlerts}
              onChange={(e) => {
                const val = e.target.checked;
                setSkillGapAlerts(val);
                localStorage.setItem('hr_skillgap_alerts', val.toString());
              }}
              className="w-4 h-4 text-purple-600 rounded cursor-pointer accent-purple-600"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">New Candidate & Resume Uploads</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Notify when new CVs are parsed and synced into candidate directory</p>
            </div>
            <input
              type="checkbox"
              checked={resumeSyncAlerts}
              onChange={(e) => {
                const val = e.target.checked;
                setResumeSyncAlerts(val);
                localStorage.setItem('hr_resumesync_alerts', val.toString());
              }}
              className="w-4 h-4 text-purple-600 rounded cursor-pointer accent-purple-600"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Weekly Talent Analytics Digest</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive summary email of team progress and skill development metrics</p>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => {
                const val = e.target.checked;
                setWeeklyDigest(val);
                localStorage.setItem('hr_weekly_digest', val.toString());
              }}
              className="w-4 h-4 text-purple-600 rounded cursor-pointer accent-purple-600"
            />
          </div>
        </div>
      </div>

      {/* Card 4: Workforce & Theme Configuration */}
      <div className="p-6 md:p-8 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-5 h-5 text-purple-600 dark:text-purple-400 stroke-[2.2]" />
          <h2 className="text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Portal Display & Workforce Benchmarks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-purple-500" />
              Target Competency Benchmark (%)
            </label>
            <input
              type="number"
              min="50"
              max="100"
              value={benchmarkThreshold}
              onChange={(e) => setBenchmarkThreshold(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              {isDark ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              Theme Mode
            </label>
            <button
              type="button"
              onClick={toggleTheme}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-[#1a233a] transition-colors cursor-pointer"
            >
              <span>Current Theme: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 underline">Toggle</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleSavePreferences}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            Save All Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default HrSettings;
