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
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminProfile = () => {
  const { user, login } = useAuth();
  const fileInputRef = useRef(null);

  // Profile fields state initialized from auth user / localStorage
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('admin_profile_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
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
  const [copiedOtp, setCopiedOtp] = useState(false);

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4500);
  };

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

      showToast('Profile photo updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfile((prev) => ({ ...prev, avatar: '' }));
    localStorage.removeItem('userAvatar');
    const updatedUser = { ...(user || {}), avatar: '' };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    login(updatedUser);
    showToast('Profile photo removed.');
  };

  // Save Profile Details
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profile.name || !profile.email) {
      showToast('Name and email are required.');
      return;
    }

    localStorage.setItem('admin_profile_data', JSON.stringify(profile));
    
    // Synchronize with AuthContext so topbar immediately updates
    const updatedUser = {
      ...(user || {}),
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      role: 'admin'
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    login(updatedUser);

    showToast('✅ Admin profile details saved successfully!');
  };

  // Step 1: Send OTP to Admin's Email
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in current, new, and confirm password fields.');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirm password do not match.');
      return;
    }

    // Generate random 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    showToast(`Verification OTP dispatched to ${profile.email}! Code: ${code}`);
  };

  // Step 2: Verify OTP & Change Password
  const handleVerifyOtpAndChangePassword = (e) => {
    e.preventDefault();
    if (!userOtpInput) {
      showToast('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    if (userOtpInput.trim() !== generatedOtp) {
      showToast('Invalid OTP code. Please check the code and try again.');
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
    showToast('✅ Password changed successfully with 2FA email verification!');
  };

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(generatedOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
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

      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 shadow-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

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
          /* Step 1: Input Passwords & Request OTP */
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3.5 pr-10 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3.5 pr-10 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-[#2b3854] rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send OTP to Email ({profile.email})</span>
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: OTP Verification Box */
          <form onSubmit={handleVerifyOtpAndChangePassword} className="space-y-5 animate-fade-in">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-teal-400">
                  <Mail className="w-4 h-4" />
                  <span>Email OTP Dispatched to {profile.email}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyOtp}
                  className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-blue-700"
                >
                  {copiedOtp ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedOtp ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <p className="text-xs font-mono font-extrabold text-slate-900 dark:text-white">
                Simulated Email OTP Code: <strong className="text-blue-600 dark:text-teal-400 text-sm tracking-widest bg-blue-500/20 px-2.5 py-1 rounded-md">{generatedOtp}</strong>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Enter the 6-digit confirmation OTP code generated above to finalize your password update.
              </p>
            </div>

            <div className="space-y-1.5 max-w-sm">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-blue-500" />
                <span>Enter 6-Digit Email OTP</span>
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
