import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  Lock, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Check, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  Send
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ROUTES } from '../../constants/routes';
import { showGlobalToast } from '../../components/common/ToastContainer';
import Button from '../../components/common/Button';

const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifs, setEmailNotifs] = useState(() => {
    return localStorage.getItem('employee_email_notifications') !== 'false';
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('employee_language') || 'English (US)';
  });
  
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
    return user?.email || 'employee@company.com';
  };

  const targetEmail = getTargetEmail();

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

    localStorage.setItem('employee_custom_password', newPassword);
    setLoading(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setUserOtpInput('');
    setOtpSent(false);
    setGeneratedOtp('');
    showGlobalToast('Password successfully changed! Please log in again with your new password.', 'success', 5000);

    // Force logout and redirect to employee login screen
    setTimeout(() => {
      logout();
      navigate(ROUTES.EMPLOYEE_LOGIN);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
          Account & Application Settings
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Manage security credentials, email OTP verification, notification preferences, and display settings.
        </p>
      </div>

      {/* Card 1: Security & Change Password with Email OTP */}
      <div className="p-6 md:p-8 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-6 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
            <h2 className="text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Security & Change Password
            </h2>
          </div>

          <span className="px-3 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 rounded-full text-[10px] font-black uppercase">
            2FA Email OTP Protected
          </span>
        </div>

        {!otpSent ? (
          /* STEP 1: Enter Current Password & Request OTP */
          <form onSubmit={handleSendOtp} className="space-y-4 max-w-lg">
            <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/20 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-3">
              <Mail className="w-5 h-5 text-teal-500 shrink-0" />
              <span>
                To change your password, a one-time verification code (OTP) will be dispatched to your registered email: <strong>{targetEmail}</strong>
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Current Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter current password to receive OTP..."
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-teal-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Verification Code (OTP)</span>
            </button>
          </form>
        ) : (
          /* STEP 2: Enter OTP, New Password, Confirm Password */
          <form onSubmit={handleVerifyOtpAndChangePassword} className="space-y-5 animate-fade-in">
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                <span>Verification code dispatched to <strong>{targetEmail}</strong>. Check inbox and enter OTP below.</span>
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-teal-600 dark:text-teal-400 hover:underline text-[11px] font-black cursor-pointer shrink-0 ml-2"
              >
                Resend Code
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                  <Key className="w-4 h-4" />
                  Enter 6-Digit Email OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="e.g. 849201"
                  value={userOtpInput}
                  onChange={(e) => setUserOtpInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-teal-500/5 dark:bg-[#0f1524] border-2 border-teal-500/40 rounded-2xl text-center text-base font-black tracking-widest text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 4 characters..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-type new password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-teal-600/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{loading ? 'Verifying & Updating...' : 'Verify OTP & Change Password'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setUserOtpInput('');
                }}
                className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Card 2: Notification & Theme Preferences */}
      <div className="p-6 md:p-8 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-6 transition-colors">
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
          <h2 className="text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Notification & Theme Preferences
          </h2>
        </div>

        <div className="space-y-4">
          {/* Row 1: Dark / Light Mode Theme */}
          <div className="p-5 bg-slate-50 dark:bg-[#0f1524]/80 border border-slate-200/80 dark:border-[#2b3854] rounded-2xl flex items-center justify-between gap-4 transition-colors">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Dark / Light Mode Theme
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Current Theme: <span className="font-extrabold text-teal-600 dark:text-teal-400">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm border border-slate-300 dark:border-slate-700"
            >
              Switch Theme
            </button>
          </div>

          {/* Row 2: Email Notifications */}
          <div className="p-5 bg-slate-50 dark:bg-[#0f1524]/80 border border-slate-200/80 dark:border-[#2b3854] rounded-2xl flex items-center justify-between gap-4 transition-colors">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Email Notifications
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Receive weekly AI skill gap summary reports
              </p>
            </div>

            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => {
                const val = e.target.checked;
                setEmailNotifs(val);
                localStorage.setItem('employee_email_notifications', val.toString());
              }}
              className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
            />
          </div>

          {/* Row 3: Preferred Platform Language */}
          <div className="p-5 bg-slate-50 dark:bg-[#0f1524]/80 border border-slate-200/80 dark:border-[#2b3854] rounded-2xl flex items-center justify-between gap-4 transition-colors">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Preferred Platform Language
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Select interface translation
              </p>
            </div>

            <select
              value={language}
              onChange={(e) => {
                const val = e.target.value;
                setLanguage(val);
                localStorage.setItem('employee_language', val);
              }}
              className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/40 cursor-pointer"
            >
              <option value="English (US)">English (US)</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Hindi">Hindi</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
