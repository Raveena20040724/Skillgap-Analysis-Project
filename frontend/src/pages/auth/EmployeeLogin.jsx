import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ROUTES } from '../../constants/routes';
import { Eye, EyeOff, CheckCircle2, BrainCircuit } from 'lucide-react';

const roleRedirects = {
  employee: ROUTES.EMPLOYEE_DASHBOARD,
  hr: ROUTES.HR_DASHBOARD,
  admin: ROUTES.ADMIN_DASHBOARD,
};

const EmployeeLogin = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: location.state?.username || '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(
    location.state?.registered ? 'Account created successfully! Please sign in below.' : ''
  );
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.username) {
      setFormData(prev => ({ ...prev, username: location.state.username }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const inputUser = (formData.username || '').trim();
    const inputPassword = formData.password || '';

    // 1. Field presence validation
    if (!inputUser && !inputPassword) {
      setError('Please enter both username and password.');
      return;
    }
    if (!inputUser) {
      setError('Please enter your username or email address.');
      return;
    }
    if (!inputPassword) {
      setError('Please enter your password.');
      return;
    }

    // Check System Maintenance Mode
    const isMaintenance = localStorage.getItem('system_maintenance_mode') === 'true';
    if (isMaintenance) {
      const lowerUser = inputUser.toLowerCase();
      if (!lowerUser.includes('admin')) {
        setError('⚠️ System Maintenance Mode is currently active for database upgrades. Employee logins are temporarily restricted. Please try again later or contact your administrator.');
        return;
      }
    }

    setLoading(true);
    const lowerUser = inputUser.toLowerCase();

    // 2. Try real API login first
    try {
      const response = await authService.login({
        username: inputUser,
        password: inputPassword
      });
      const authData = response.data?.data || response.data;
      const access = authData?.access;
      const refresh = authData?.refresh;
      const user = authData?.user;

      if (user && access) {
        setSuccessMsg(`Welcome back, ${user.name || user.username}! Login successful. Redirecting...`);
        setTimeout(() => {
          login(user, access, refresh);
          navigate(roleRedirects[user.role] || ROUTES.EMPLOYEE_DASHBOARD);
        }, 500);
        return;
      }
    } catch (err) {
      console.warn('API login attempt failed, checking local accounts...', err);
    }

    // 3. Known / Registered Users Database check
    const registeredEmployees = JSON.parse(localStorage.getItem('registered_employees_list') || '[]');
    const localHrs = [
      ...JSON.parse(localStorage.getItem('all_hr_users_list') || '[]'),
      ...JSON.parse(localStorage.getItem('custom_hr_users') || '[]')
    ];

    const matchedEmp = registeredEmployees.find(u =>
      (u.username && u.username.toLowerCase() === lowerUser) ||
      (u.email && u.email.toLowerCase() === lowerUser)
    );

    const isDemoEmp = (lowerUser === 'alex_morgan' || lowerUser === 'alex.morgan@company.com');
    const isDemoHr = (lowerUser === 'sarah_hr' || lowerUser === 'sarah.jenkins@company.com' || lowerUser === 'hr');
    const isDemoAdmin = (lowerUser === 'admin' || lowerUser === 'admin@company.com');

    const matchedHr = localHrs.find(h =>
      (h.email && h.email.toLowerCase() === lowerUser) ||
      (h.name && h.name.toLowerCase() === lowerUser) ||
      (h.username && h.username.toLowerCase() === lowerUser)
    );

    const usernameExists = Boolean(matchedEmp || isDemoEmp || isDemoHr || isDemoAdmin || matchedHr);

    // Case 1: Username exists in Registered Accounts
    if (matchedEmp) {
      if (matchedEmp.password && matchedEmp.password !== inputPassword) {
        setError('Incorrect password. Please verify your password and try again.');
        setLoading(false);
        return;
      }

      const empUserObj = {
        id: matchedEmp.id || Date.now(),
        username: matchedEmp.username,
        name: matchedEmp.username,
        email: matchedEmp.email,
        role: 'employee',
        department: matchedEmp.department || '',
        phone: matchedEmp.phone || '',
        designation: matchedEmp.designation || '',
        avatar: matchedEmp.avatar || ''
      };
      const mockToken = `mock_employee_token_` + Date.now();
      setSuccessMsg(`Welcome back, ${empUserObj.username}! Login successful. Redirecting...`);
      setTimeout(() => {
        login(empUserObj, mockToken, mockToken);
        navigate(ROUTES.EMPLOYEE_DASHBOARD);
      }, 500);
      return;
    }

    // Case 2: Username is Alex Morgan (Demo Employee)
    if (isDemoEmp) {
      if (inputPassword === 'password123' || inputPassword === 'employee123') {
        const demoUser = {
          id: 3,
          username: 'alex_morgan',
          name: 'Alex Morgan',
          email: 'alex.morgan@company.com',
          role: 'employee',
          department: 'Engineering',
          designation: 'Senior Frontend Developer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
        };
        const mockToken = `mock_employee_token_` + Date.now();
        setSuccessMsg(`Welcome back, Alex Morgan! Login successful. Redirecting...`);
        setTimeout(() => {
          login(demoUser, mockToken, mockToken);
          navigate(ROUTES.EMPLOYEE_DASHBOARD);
        }, 500);
        return;
      } else {
        setError('Incorrect password. Please verify your password and try again.');
        setLoading(false);
        return;
      }
    }

    // Case 3: Username is HR account
    if (matchedHr) {
      if (matchedHr.password ? matchedHr.password === inputPassword : (inputPassword === 'password123' || inputPassword === 'hr123')) {
        const hrUserObj = {
          id: matchedHr.id || Date.now(),
          username: matchedHr.name || matchedHr.email,
          name: matchedHr.name,
          email: matchedHr.email,
          role: 'hr',
          department: matchedHr.department || 'People Operations',
          company: matchedHr.company || 'TechCorp Systems',
          avatar: matchedHr.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
        };
        const mockToken = `mock_hr_token_` + Date.now();
        login(hrUserObj, mockToken, mockToken);
        navigate(ROUTES.HR_DASHBOARD);
        setLoading(false);
        return;
      } else {
        setError('Incorrect password. Please verify your password and try again.');
        setLoading(false);
        return;
      }
    }

    if (isDemoHr) {
      if (inputPassword === 'password123' || inputPassword === 'hr123') {
        const hrUserObj = {
          id: 2,
          username: 'sarah_hr',
          name: 'Sarah Jenkins',
          email: 'sarah.jenkins@company.com',
          role: 'hr',
          department: 'People Operations',
          company: 'TechCorp Systems',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
        };
        const mockToken = `mock_hr_token_` + Date.now();
        login(hrUserObj, mockToken, mockToken);
        navigate(ROUTES.HR_DASHBOARD);
        setLoading(false);
        return;
      } else {
        setError('Incorrect password. Please verify your password and try again.');
        setLoading(false);
        return;
      }
    }

    // Case 4: Username is Admin
    if (isDemoAdmin) {
      if (inputPassword === 'password123' || inputPassword === 'admin123') {
        const adminUser = {
          id: 1,
          username: 'Marcus Vance',
          name: 'Marcus Vance',
          email: 'admin@company.com',
          role: 'admin',
          department: 'Executive Leadership & DevOps',
          avatar: localStorage.getItem('userAvatar') || ''
        };
        const mockToken = `mock_admin_token_` + Date.now();
        login(adminUser, mockToken, mockToken);
        navigate(ROUTES.ADMIN_DASHBOARD);
        setLoading(false);
        return;
      } else {
        setError('Incorrect password. Please verify your password and try again.');
        setLoading(false);
        return;
      }
    }

    // Case 5: Username doesn't exist vs Both incorrect
    if (!usernameExists) {
      // If user typed random credentials on both
      if (inputPassword.length < 4) {
        setError('Both username and password are incorrect.');
      } else {
        setError("Username doesn't exist. Please check your username or click 'Create one' to register.");
      }
      setLoading(false);
      return;
    }

    // Default error
    setError('Both username and password are incorrect.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-teal-800 via-teal-900 to-emerald-950 text-white relative flex flex-col justify-between p-6 md:p-10 font-sans overflow-x-hidden select-none">
      {/* Decorative ambient background spheres */}
      <div className="w-[600px] h-[600px] rounded-full bg-white/10 absolute -top-40 -right-40 pointer-events-none blur-2xl"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-teal-400/20 absolute -bottom-32 -left-32 pointer-events-none blur-3xl"></div>

      {/* Top Header Logo */}
      <header className="relative z-10 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl p-0.5 shadow-md bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 shadow-teal-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-white block leading-tight">SkillBridge<span className="text-teal-400">.AI</span></span>
            <span className="text-[10px] font-bold text-teal-300 tracking-wider uppercase block">Employee Workspace</span>
          </div>
        </div>
      </header>

      {/* Main Grid Section */}
      <main className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-8">
        {/* Left Column: Hero Content */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left pr-0 lg:pr-8">
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
            Accelerate Your Growth & Master Essential Skills
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base md:text-lg text-teal-100/90 font-medium max-w-lg leading-relaxed">
            Analyze skill gaps, track learning milestones, and unlock strategic career recommendations designed for your professional success.
          </p>
        </div>

        {/* Right Column: Floating Auth Card */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-2xl shadow-teal-950/30 text-slate-900 max-w-md w-full mx-auto lg:ml-auto relative">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign in to account</h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Enter your details to access your portal</p>
            </div>

            {localStorage.getItem('system_maintenance_mode') === 'true' && (
              <div className="p-3.5 mb-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold text-center">
                ⚠️ System Maintenance Mode Active: Employee logins restricted during database upgrades.
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 mb-6 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {error && (
              <div className="p-3.5 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Username</label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Password</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl pl-4 pr-12 py-3.5 text-sm font-medium transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-teal-600 focus:outline-none cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-extrabold py-3.5 px-6 rounded-full shadow-lg shadow-teal-500/30 transition-all duration-200 cursor-pointer disabled:opacity-70 text-sm"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>

            <p className="text-xs text-center mt-6 text-slate-500 font-semibold">
              Don't have an account?{' '}
              <Link to={ROUTES.EMPLOYEE_REGISTER} className="text-teal-600 font-bold hover:underline">
                Create one
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

export default EmployeeLogin;