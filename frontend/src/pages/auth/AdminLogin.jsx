import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ROUTES } from '../../constants/routes';
import { ShieldCheck, Lock, Mail, Server, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
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

    if (!formData.email || !formData.password) {
      setError('Please enter Admin Email/Username and Password.');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        username: formData.email,
        password: formData.password
      });
      const authData = response.data?.data || response.data;
      const access = authData?.access;
      const refresh = authData?.refresh;
      const user = authData?.user;

      if (user && access) {
        login({ ...user, role: 'admin' }, access, refresh);
        navigate(ROUTES.ADMIN_DASHBOARD);
        return;
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.detail || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative flex flex-col justify-between p-6 md:p-10 font-sans overflow-x-hidden select-none">
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
              <span className="text-[10px] font-bold text-teal-400 tracking-wider uppercase block">Super Admin Security Operations</span>
            </div>
          </div>

          <Link
            to={ROUTES.EMPLOYEE_LOGIN}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all"
          >
            Employee Portal
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-8">
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left pr-0 lg:pr-8 space-y-6">
          <div className="p-3 bg-teal-500/20 border border-teal-500/30 text-teal-300 rounded-2xl inline-flex items-center gap-2 text-xs font-black tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Super Admin Security Operations</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight max-w-xl">
            System Operations & Organization Control
          </h1>

          <p className="text-base md:text-lg text-slate-300/90 font-medium max-w-lg leading-relaxed">
            Sign in to manage system users, RBAC permissions, department taxonomies, and AI inference endpoints.
          </p>
        </div>

        <div className="lg:col-span-5 w-full">
          <div className="bg-white dark:bg-[#161f33] rounded-[32px] p-8 md:p-10 shadow-2xl text-slate-900 border border-slate-200/90 dark:border-slate-800 max-w-md w-full mx-auto lg:ml-auto relative">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto mb-3 border border-teal-500/20">
                <Server className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Super Admin Sign In</h2>
              <p className="text-xs font-bold text-slate-400 mt-1">Enter your administrative credentials</p>
            </div>

            {error && (
              <div className="p-3.5 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Admin Email / Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    name="email"
                    type="text"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin.marcus@company.com"
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
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-teal-600/30 transition-all duration-200 cursor-pointer disabled:opacity-70 text-xs uppercase tracking-wider"
                >
                  {loading ? 'Authenticating Admin...' : 'Sign In to Admin Portal'}
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

export default AdminLogin;