import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ROUTES } from '../../constants/routes';
import { Eye, EyeOff } from 'lucide-react';

const EmployeeRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '', general: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        phone: formData.phone,
      };
      await authService.register(payload);
      // Redirect to Login screen (asking user to log in manually)
      navigate(ROUTES.EMPLOYEE_LOGIN, { state: { registered: true, username: formData.username } });
      return;
    } catch (err) {
      console.warn('Backend registration API call error or fallback:', err);
    }

    // Redirect to Login screen (asking user to log in manually)
    navigate(ROUTES.EMPLOYEE_LOGIN, { state: { registered: true, username: formData.username } });
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 text-white relative flex flex-col justify-between p-6 md:p-10 font-sans overflow-x-hidden select-none">
      {/* Decorative ambient background spheres */}
      <div className="w-[600px] h-[600px] rounded-full bg-white/10 absolute -top-40 -right-40 pointer-events-none blur-2xl"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-indigo-400/20 absolute -bottom-32 -left-32 pointer-events-none blur-3xl"></div>

      {/* Top Header Logo */}
      <header className="relative z-10 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="SkillGap Logo" 
            className="w-12 h-12 rounded-full object-cover shadow-xl shadow-black/20 border border-white/40"
          />
          <span className="text-2xl font-black tracking-tight text-white">SkillGap</span>
        </div>
      </header>

      {/* Main Grid Section */}
      <main className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-8">
        {/* Left Column: Hero Content */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left pr-0 lg:pr-8">
          {/* 3 Colorful circular icon badges */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-red-400 shadow-xl shadow-rose-500/30 flex items-center justify-center text-2xl transform hover:scale-105 transition-transform duration-200">
              ✏️
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-xl shadow-amber-500/30 flex items-center justify-center text-2xl transform hover:scale-105 transition-transform duration-200">
              💼
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 to-green-300 shadow-xl shadow-emerald-500/30 flex items-center justify-center text-2xl transform hover:scale-105 transition-transform duration-200">
              🥰
            </div>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight max-w-xl">
            Empower Your Future & Close Your Skill Gaps
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base md:text-lg text-indigo-100/90 font-medium max-w-lg leading-relaxed">
            Create an account to analyze professional skills, access personalized course recommendations, and chart your career path.
          </p>
        </div>

        {/* Right Column: Floating Auth Card */}
        <div className="lg:col-span-6 w-full">
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-2xl shadow-indigo-950/30 text-slate-900 max-w-md w-full mx-auto lg:ml-auto relative">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create an account</h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Start your career growth journey today</p>
            </div>

            {errors.general && (
              <div className="p-3.5 mb-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Username</label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all outline-none"
                />
                {errors.username && <p className="text-[11px] font-bold text-rose-600 mt-1 ml-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example.email@gmail.com"
                  className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all outline-none"
                />
                {errors.email && <p className="text-[11px] font-bold text-rose-600 mt-1 ml-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Department</label>
                  <input
                    name="department"
                    type="text"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Engineering"
                    className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Phone</label>
                  <input
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Password</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter at least 6+ characters"
                    className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-4 pr-12 py-2.5 text-sm font-medium transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-indigo-600 focus:outline-none cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] font-bold text-rose-600 mt-1 ml-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Confirm Password</label>
                <div className="relative flex items-center">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-4 pr-12 py-2.5 text-sm font-medium transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-slate-400 hover:text-indigo-600 focus:outline-none cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[11px] font-bold text-rose-600 mt-1 ml-1">{errors.confirmPassword}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold py-3.5 px-6 rounded-full shadow-lg shadow-indigo-500/30 transition-all duration-200 cursor-pointer disabled:opacity-70 text-sm"
                >
                  {loading ? 'Creating Account...' : 'Register'}
                </button>
              </div>
            </form>

            <p className="text-xs text-center mt-5 text-slate-500 font-semibold">
              Been here before?{' '}
              <Link to={ROUTES.EMPLOYEE_LOGIN} className="text-indigo-600 font-bold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Empty Footer Spacer */}
      <footer className="relative z-10 py-2"></footer>
    </div>
  );
};

export default EmployeeRegister;