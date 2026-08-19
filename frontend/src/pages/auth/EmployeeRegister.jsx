import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ROUTES } from '../../constants/routes';
import { Eye, EyeOff } from 'lucide-react';
import { initNewUserEnvironment } from '../../utils/userStorage';

const DEPARTMENTS_LIST = [
  'Engineering',
  'Product & UI/UX Design',
  'Data Science & AI',
  'Quality Assurance & Testing',
  'Human Resources',
  'Marketing & Sales',
  'Finance & Operations',
  'Cybersecurity & DevOps'
];

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
    const { name, value } = e.target;
    // For phone, only allow numbers and limit to 10 digits
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, phone: cleaned });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '', general: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Please enter your username';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.department) {
      newErrors.department = 'Please select your department';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (phoneDigits.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter a password';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
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
    const trimmedUsername = formData.username.trim();
    const trimmedEmail = formData.email.trim();

    try {
      const payload = {
        username: trimmedUsername,
        email: trimmedEmail,
        password: formData.password,
        department: formData.department,
        phone: formData.phone.trim(),
      };
      
      const res = await authService.register(payload);
      
      // Store in registered_employees_list for persistent reference
      const existingList = JSON.parse(localStorage.getItem('registered_employees_list') || '[]');
      const userPayload = {
        id: res.data?.data?.user?.id || Date.now(),
        username: trimmedUsername,
        name: trimmedUsername,
        email: trimmedEmail,
        password: formData.password,
        department: formData.department,
        phone: formData.phone.trim(),
        role: 'employee',
        avatar: '',
        designation: '',
        bio: '',
        location: '',
        experienceYears: 0
      };
      
      const filtered = existingList.filter(u => u.username.toLowerCase() !== trimmedUsername.toLowerCase());
      localStorage.setItem('registered_employees_list', JSON.stringify([...filtered, userPayload]));

      // Initialize clean isolated storage environment for the new user (0 skills, 1 welcome message)
      initNewUserEnvironment(trimmedUsername, userPayload);

      // Redirect to Login screen with success banner
      navigate(ROUTES.EMPLOYEE_LOGIN, { state: { registered: true, username: trimmedUsername } });
      return;
    } catch (err) {
      console.warn('Backend registration API call note:', err);
      
      if (err.response?.data?.errors) {
        const data = err.response.data;
        const errObj = {};
        if (data.errors?.username) {
          errObj.username = Array.isArray(data.errors.username) ? data.errors.username[0] : data.errors.username;
        }
        if (data.errors?.email) {
          errObj.email = Array.isArray(data.errors.email) ? data.errors.email[0] : data.errors.email;
        }
        if (data.errors?.password) {
          errObj.password = Array.isArray(data.errors.password) ? data.errors.password[0] : data.errors.password;
        }
        if (!errObj.username && !errObj.email && !errObj.password) {
          errObj.general = data.message || 'Registration failed. Please check your details.';
        }
        setErrors(errObj);
        setLoading(false);
        return;
      }

      // Offline / fallback registration handling
      const existingList = JSON.parse(localStorage.getItem('registered_employees_list') || '[]');
      const alreadyExists = existingList.some(
        u => u.username.toLowerCase() === trimmedUsername.toLowerCase() ||
             u.email.toLowerCase() === trimmedEmail.toLowerCase()
      );

      if (alreadyExists) {
        setErrors({ general: 'An account with this username or email already exists. Please sign in.' });
        setLoading(false);
        return;
      }

      const userPayload = {
        id: Date.now(),
        username: trimmedUsername,
        name: trimmedUsername,
        email: trimmedEmail,
        password: formData.password,
        department: formData.department,
        phone: formData.phone.trim(),
        role: 'employee',
        avatar: '',
        designation: '',
        bio: '',
        location: '',
        experienceYears: 0
      };
      localStorage.setItem('registered_employees_list', JSON.stringify([...existingList, userPayload]));

      // Initialize clean isolated storage environment for the new user (0 skills, 1 welcome message)
      initNewUserEnvironment(trimmedUsername, userPayload);

      navigate(ROUTES.EMPLOYEE_LOGIN, { state: { registered: true, username: trimmedUsername } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-700 via-purple-800 to-violet-900 text-white relative flex flex-col justify-between p-6 md:p-10 font-sans overflow-x-hidden select-none">
      {/* Decorative ambient background spheres */}
      <div className="w-[600px] h-[600px] rounded-full bg-white/10 absolute -top-40 -right-40 pointer-events-none blur-2xl"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-purple-400/20 absolute -bottom-32 -left-32 pointer-events-none blur-3xl"></div>

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
          <p className="text-base md:text-lg text-purple-100/90 font-medium max-w-lg leading-relaxed">
            Create an account to analyze professional skills, access personalized course recommendations, and chart your career path.
          </p>
        </div>

        {/* Right Column: Floating Auth Card */}
        <div className="lg:col-span-6 w-full">
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-2xl shadow-purple-950/30 text-slate-900 max-w-md w-full mx-auto lg:ml-auto relative">
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
                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">
                  Username <span className="text-rose-500">*</span>
                </label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. varsha_dev"
                  className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all outline-none"
                />
                {errors.username && <p className="text-[11px] font-bold text-rose-600 mt-1 ml-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example.email@gmail.com"
                  className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all outline-none"
                />
                {errors.email && <p className="text-[11px] font-bold text-rose-600 mt-1 ml-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 border border-transparent focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 rounded-2xl px-3 py-2.5 text-xs font-semibold transition-all outline-none cursor-pointer"
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS_LIST.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.department && <p className="text-[11px] font-bold text-rose-600 mt-1 ml-1">{errors.department}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">
                    Phone Number (10 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all outline-none"
                  />
                  {errors.phone && <p className="text-[11px] font-bold text-rose-600 mt-1 ml-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter at least 6+ characters"
                    className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 rounded-2xl pl-4 pr-12 py-2.5 text-sm font-medium transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-purple-600 focus:outline-none cursor-pointer"
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
                    className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 rounded-2xl pl-4 pr-12 py-2.5 text-sm font-medium transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-slate-400 hover:text-purple-600 focus:outline-none cursor-pointer"
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
                  className="w-full bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-extrabold py-3.5 px-6 rounded-full shadow-lg shadow-purple-500/30 transition-all duration-200 cursor-pointer disabled:opacity-70 text-sm"
                >
                  {loading ? 'Creating Account...' : 'Register'}
                </button>
              </div>
            </form>

            <p className="text-xs text-center mt-5 text-slate-500 font-semibold">
              Been here before?{' '}
              <Link to={ROUTES.EMPLOYEE_LOGIN} className="text-purple-600 font-bold hover:underline">
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