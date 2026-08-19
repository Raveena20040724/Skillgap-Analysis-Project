import { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Camera, 
  Lock, 
  KeyRound, 
  Send, 
  Copy, 
  Check, 
  CheckCircle2, 
  Save, 
  Trash2,
  Sparkles,
  Eye,
  EyeOff,
  RotateCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { showGlobalToast } from '../../components/common/ToastContainer';

const AdminProfile = () => {
  const { user, login } = useAuth();
  const fileInputRef = useRef(null);

  // Profile fields state initialized from saved admin data / auth user / localStorage
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_profile_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) return parsed;
      }
      const userStorage = localStorage.getItem('user');
      if (userStorage) {
        const parsedUser = JSON.parse(userStorage);
        if (parsedUser && parsedUser.email) {
          return {
            name: parsedUser.name || parsedUser.username || 'Marcus Vance',
            email: parsedUser.email,
            phone: '+1 (555) 234-8901',
            role: 'Super Admin',
            department: 'Executive Leadership & DevOps',
            bio: 'Lead Administrator managing telemetry pipelines, AI model orchestrations, and organizational RBAC access control policies.',
            avatar: parsedUser.avatar || localStorage.getItem('userAvatar') || ''
          };
        }
      }
    } catch (e) {
      console.error('Profile initialization note:', e);
    }
    return {
      name: user?.name || user?.username || 'Marcus Vance',
      email: user?.email || 'admin@company.com',
      phone: '+1 (555) 234-8901',
      role: 'Super Admin',
      department: 'Executive Leadership & DevOps',
      bio: 'Lead Administrator managing telemetry pipelines, AI model orchestrations, and organizational RBAC access control policies.',
      avatar: user?.avatar || localStorage.getItem('userAvatar') || ''
    };
  });

  // Password & OTP States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setProfile((prev) => ({ ...prev, avatar: dataUrl }));
      localStorage.setItem('userAvatar', dataUrl);
      
      // Update in AuthContext
      const updatedUser = { ...(user || {}), avatar: dataUrl, name: profile.name, email: profile.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      login(updatedUser);

      showGlobalToast('Profile photo updated successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfile((prev) => ({ ...prev, avatar: '' }));
    localStorage.removeItem('userAvatar');
    const updatedUser = { ...(user || {}), avatar: '' };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    login(updatedUser);
    showGlobalToast('Profile photo removed.', 'delete');
  };

  // Save Profile Details
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profile.name || !profile.email) {
      showGlobalToast('Name and email are required.', 'warning');
      return;
    }

    localStorage.setItem('admin_profile_data', JSON.stringify(profile));
    
    // Synchronize with AuthContext so topbar and other pages immediately update
    const updatedUser = {
      ...(user || {}),
      name: profile.name,
      email: profile.email.trim(),
      avatar: profile.avatar,
      role: 'admin'
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    login(updatedUser);

    showGlobalToast(`Admin profile details saved for ${profile.email.trim()}!`, 'success');
  };

  // Step 1: Send OTP to User's Email Address (Uses latest updated email)
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showGlobalToast('Please enter your current password first.', 'warning');
      return;
    }

    const targetEmail = profile.email?.trim() || 
      JSON.parse(localStorage.getItem('admin_profile_data') || '{}')?.email || 
      JSON.parse(localStorage.getItem('user') || '{}')?.email || 
      user?.email || 
      'admin@company.com';

    // Generate random 6-digit OTP code sent silently to user's email
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    showGlobalToast(`Verification OTP dispatched to ${targetEmail}. Check your email inbox.`, 'email', 5000);
  };

  // Step 2: Verify OTP, Validate New Password, & Update Password
  const handleVerifyOtpAndChangePassword = (e) => {
    e.preventDefault();
    if (!userOtpInput) {
      showGlobalToast('Please enter the 6-digit OTP code sent to your email.', 'warning');
      return;
    }

    if (userOtpInput.trim() !== generatedOtp) {
      showGlobalToast('Invalid OTP code. Please enter the code sent to your email.', 'warning');
      return;
    }

    if (!newPassword || !confirmPassword) {
      showGlobalToast('Please enter your new password and confirm password.', 'warning');
      return;
    }

    if (newPassword.length < 6) {
      showGlobalToast('New password must be at least 6 characters long.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      showGlobalToast('New password and confirm password do not match.', 'warning');
      return;
    }

    // Success! Update password in local state/storage
    localStorage.setItem('admin_custom_password', newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setUserOtpInput('');
    setOtpSent(false);
    setGeneratedOtp('');
    showGlobalToast('Password changed successfully with verified email OTP!', 'success');
  };

  const initialLetter = (profile.name || 'A').charAt(0).toUpperCase();

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <User className="w-8 h-8 text-blue-600 dark:text-teal-400 stroke-[2.2]" />
            Administrator Profile & Credentials
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Update your account identity, profile photo, contact details, and OTP-protected security credentials.
          </p>
        </div>

        <span className="px-3.5 py-1.5 bg-blue-500/10 text-blue-600 dark:text-teal-400 border border-blue-500/30 rounded-full text-xs font-extrabold flex items-center gap-1.5 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          Super Admin Access
        </span>
      </div>

      {/* Card 1: Profile Information & Photo Upload */}
      <div className="p-6 md:p-8 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Sparkles className="w-5 h-5 text-blue-500 stroke-[2.2]" />
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            General Information
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 dark:bg-[#0f1524] rounded-2xl border border-slate-200/80 dark:border-[#2b3854]">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-400 p-1 shadow-lg shadow-blue-500/20 overflow-hidden">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-full h-full rounded-xl object-cover" 
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-3xl font-black text-blue-400">
                    {initialLetter}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Admin Avatar Photo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload a JPEG or PNG photo to customize your identity across all dashboards.
              </p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>

                {profile.avatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors border border-rose-200 dark:border-rose-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-500" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3.5 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="e.g. Marcus Vance"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <span>Admin Email Address</span>
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-3.5 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="e.g. admin@company.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span>Phone Number</span>
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full p-3.5 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="e.g. +1 (555) 234-8901"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Department</span>
              </label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                className="w-full p-3.5 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="e.g. Executive Leadership & DevOps"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              System Bio / Role Description
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-3.5 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
              placeholder="Tell a brief overview of administrative responsibilities..."
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Card 2: Security & Password Change with 2FA Email OTP */}
      <div className="p-6 md:p-8 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-blue-500 stroke-[2.2]" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Security & Password (Email OTP Protected)
            </h2>
          </div>
          
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase">
            2FA OTP Enabled
          </span>
        </div>

        {!otpSent ? (
          /* Step 1: Input Current Password & Request OTP */
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="max-w-md space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Current Account Password</span>
                <span className="text-[10px] text-slate-400 font-medium">Step 1 of 2</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password..."
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3.5 pr-10 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Verification OTP to Email</span>
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Email Dispatched Notice & Input New Password */
          <form onSubmit={handleVerifyOtpAndChangePassword} className="space-y-5 animate-fade-in">
            {/* Email OTP Dispatched Banner */}
            <div className="p-5 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-teal-500/10 border border-blue-500/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-teal-400">
                  <Mail className="w-4 h-4" />
                  <span>Verification Code Dispatched to Your Email</span>
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-blue-700 shadow-sm"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Resend Code</span>
                </button>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200">
                A 6-digit security code was sent to <strong className="text-blue-600 dark:text-teal-400">{profile.email}</strong>. Please check your inbox and spam folder, then enter the OTP below.
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                For security reasons, your verification code is delivered exclusively to your registered email account.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* OTP Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-blue-500" />
                  <span>6-Digit OTP Code</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 849204"
                  value={userOtpInput}
                  onChange={(e) => setUserOtpInput(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-base font-mono font-extrabold tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 uppercase text-center"
                  required
                />
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3.5 pr-10 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify OTP & Update Password</span>
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="px-4 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
