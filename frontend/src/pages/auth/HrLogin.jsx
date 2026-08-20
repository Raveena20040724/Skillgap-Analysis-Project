import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ROUTES } from '../../constants/routes';
import { Users, Lock, Mail, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const HrLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const inputEmail = (formData.email || '').trim();
    const inputPassword = formData.password || '';

    // Distinct field validations
    if (!inputEmail && !inputPassword) {
      setError('Please enter your HR Email/Username and password.');
      return;
    }
    if (!inputEmail) {
      setError('Please enter your HR Email or Username.');
      return;
    }
    if (!inputPassword) {
      setError('Please enter your password.');
      return;
    }

    // Check System Maintenance Mode
    const isMaintenance = localStorage.getItem('system_maintenance_mode') === 'true';
    if (isMaintenance) {
      setError('⚠️ System Maintenance Mode is currently active. HR portal access is temporarily restricted.');
      return;
    }

    setLoading(true);

    const lowerEmail = inputEmail.toLowerCase();
    let backendErrorMsg = '';

    try {
      // 1. First check if API login works
      const response = await authService.login({
        username: inputEmail,
        password: inputPassword
      });
      const authData = response.data?.data || response.data;
      const access = authData?.access;
      const refresh = authData?.refresh;
      const user = authData?.user;

      if (user && access) {
        if (user.role !== 'hr' && user.role !== 'admin') {
          setError('Access denied. This portal is restricted to HR personnel.');
          setLoading(false);
          return;
        }
        login({ ...user, role: user.role || 'hr' }, access, refresh);
        navigate(ROUTES.HR_DASHBOARD);
        return;
      }
    } catch (err) {
      console.warn('Backend HR login attempt failed, checking fallback...', err);
      backendErrorMsg = err.response?.data?.message || err.response?.data?.detail;
    }

    // 2. API call fallback -> check local stored HR accounts created by Admin
    const localHrs = [
      ...JSON.parse(localStorage.getItem('all_hr_users_list') || '[]'),
      ...JSON.parse(localStorage.getItem('custom_hr_users') || '[]')
    ];
    const matchedHr = localHrs.find(
      (h) => (h.email && h.email.toLowerCase() === lowerEmail) ||
             (h.name && h.name.toLowerCase() === lowerEmail) ||
             (h.username && h.username.toLowerCase() === lowerEmail)
    );

    // Case 1: HR account exists in custom/admin list
    if (matchedHr) {
      if (matchedHr.password ? matchedHr.password === inputPassword : (inputPassword === 'password123' || inputPassword === 'hr123')) {
        const userObj = {
          id: matchedHr.id || Date.now(),
          name: matchedHr.name,
          username: matchedHr.name,
          email: matchedHr.email,
          role: 'hr',
          company: matchedHr.company || 'TechCorp Systems',
          department: matchedHr.department || 'People Operations',
          avatar: matchedHr.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
        };

        const mockToken = 'mock_hr_token_' + Date.now();
        login(userObj, mockToken, mockToken);
        navigate(ROUTES.HR_DASHBOARD);
        setLoading(false);
        return;
      } else {
        setError('Incorrect password. Please verify your password and try again.');
        setLoading(false);
        return;
      }
    }

    // Case 2: Default demo HR account check with exact credentials
    if (lowerEmail === 'sarah_hr' || lowerEmail === 'sarah.jenkins@company.com' || lowerEmail === 'hr@company.com' || lowerEmail === 'hr') {
      if (inputPassword === 'password123' || inputPassword === 'hr123') {
        const userObj = {
          id: 2,
          name: 'Sarah Jenkins',
          username: 'sarah_hr',
          email: 'sarah.jenkins@company.com',
          role: 'hr',
          company: 'TechCorp Systems',
          department: 'People Operations',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
        };

        const mockToken = 'mock_hr_token_' + Date.now();
        login(userObj, mockToken, mockToken);
        navigate(ROUTES.HR_DASHBOARD);
        setLoading(false);
        return;
      } else {
        setError('Incorrect password. Please verify your password and try again.');
        setLoading(false);
        return;
      }
    }

    // Case 3: Username doesn't exist vs Both incorrect
    if (inputPassword.length < 4) {
      setError('Both username and password are incorrect.');
    } else {
      setError("Username doesn't exist. Please check your username or contact your administrator.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white relative flex flex-col justify-between p-6 md:p-10 font-sans overflow-x-hidden select-none">
      {/* Decorative ambient background spheres */}
      <div className="w-[600px] h-[600px] rounded-full bg-teal-500/10 absolute -top-40 -right-40 pointer-events-none blur-3xl"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-emerald-500/10 absolute -bottom-32 -left-32 pointer-events-none blur-3xl"></div>

      {/* Top Header Logo */}
      <header className="relative z-10 max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="SkillBridge Logo" 
              className="w-12 h-12 rounded-2xl object-cover shadow-xl shadow-black/40 border border-white/20"
            />
            <div>
              <span className="text-2xl font-black tracking-tight text-white block leading-tight">SkillBridge.AI</span>
              <span className="text-[10px] font-bold text-teal-400 tracking-wider uppercase block">Workforce HR Portal</span>
            </div>
          </div>

          <Link
            to={ROUTES.EMPLOYEE_LOGIN}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all"
          >
            Employee Sign In
          </Link>
        </div>
      </header>

      {/* Main Grid Section */}
      <main className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-8">
        {/* Left Hero Content */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left pr-0 lg:pr-8 space-y-6">
          <div className="p-3 bg-teal-500/20 border border-teal-500/30 text-teal-300 rounded-2xl inline-flex items-center gap-2 text-xs font-black tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Authorized HR Manager Portal</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight max-w-xl">
            Empower Talent & Audit Workforce Skill Readiness
          </h1>

          <p className="text-base md:text-lg text-teal-100/90 font-medium max-w-lg leading-relaxed">
            Sign in to review organization skill metrics, assign learning path assessments, and inspect department readiness reports.
          </p>
        </div>

        {/* Right Auth Card */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white dark:bg-[#161f33] rounded-[32px] p-8 md:p-10 shadow-2xl shadow-teal-950/50 text-slate-900 border border-slate-200/90 dark:border-slate-800 max-w-md w-full mx-auto lg:ml-auto relative">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto mb-3 border border-teal-500/20">
                <Users className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">HR Manager Sign In</h2>
              <p className="text-xs font-bold text-slate-400 mt-1">Enter your assigned HR credentials to sign in</p>
            </div>

            {localStorage.getItem('system_maintenance_mode') === 'true' && (
              <div className="p-3.5 mb-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold text-center">
                ⚠️ System Maintenance Mode Active: HR logins restricted during database upgrades.
              </div>
            )}

            {error && (
              <div className="p-3.5 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">HR Email / Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    name="email"
                    type="text"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="sarah.jenkins@company.com"
                    className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-12 py-3.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-teal-600 focus:outline-none cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-teal-600/30 transition-all duration-200 cursor-pointer disabled:opacity-70 text-xs uppercase tracking-wider"
                >
                  {loading ? 'Authenticating HR...' : 'Sign In to HR Dashboard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-2"></footer>
    </div>
  );
};

export default HrLogin;