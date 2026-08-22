import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Globe, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  CheckCircle2, 
  Share2,
  UserCheck,
  FolderGit2,
  Sparkles,
  Zap,
  Plus,
  User,
  Trash2,
  Hash,
  Calendar
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import { showGlobalToast } from '../../components/common/ToastContainer';
import { getUserData, setUserData, getActiveUser } from '../../utils/userStorage';
import { ROUTES } from '../../constants/routes';

const EMPTY_PROFILE = {
  name: '',
  employeeNumber: '',
  designation: '',
  department: '',
  bio: '',
  location: '',
  country: '',
  yop: '',
  email: '',
  phone: '',
  experienceYears: 0,
  avatar: '',
  linkedin: '',
  github: '',
  portfolio: '',
  workExperience: [],
  certifications: [],
  projects: [],
  technicalSkills: [],
};

const sanitizeProfile = (raw, activeUser) => {
  const isDemoAlex = activeUser?.username === 'alex_morgan';
  const name = raw?.name || raw?.fullName || activeUser?.name || activeUser?.username || '';
  const email = raw?.email || activeUser?.email || '';
  const department = raw?.department || activeUser?.department || '';
  const phone = raw?.phone !== undefined ? raw.phone : (activeUser?.phone || '');

  const userSavedCustomProfile = raw?.userSavedCustomProfile === true;

  let designation = raw?.designation ?? '';
  if (!userSavedCustomProfile && !isDemoAlex && designation === 'Senior Frontend Developer') {
    designation = '';
  }

  let location = raw?.location ?? '';
  if (!userSavedCustomProfile && !isDemoAlex && location === 'San Francisco, CA') {
    location = '';
  }

  let bio = raw?.bio ?? '';
  if (!userSavedCustomProfile && !isDemoAlex && bio.includes('Passionate Web Architect')) {
    bio = '';
  }

  let experienceYears = Number(raw?.experienceYears) || Number(raw?.experience_years) || 0;
  if (!userSavedCustomProfile && !isDemoAlex && experienceYears === 3) {
    experienceYears = 0;
  }

  const employeeNumber = raw?.employeeNumber !== undefined ? raw.employeeNumber : (isDemoAlex ? 'EMP-1001' : '');
  const yop = raw?.yop !== undefined ? raw.yop : (isDemoAlex ? '2024' : '');
  const country = raw?.country !== undefined ? raw.country : (isDemoAlex ? 'United States' : '');
  
  let avatar = raw?.avatar || '';
  // Ignore unsplash default fallback image for non-demo accounts
  if (!isDemoAlex && avatar.includes('unsplash.com')) {
    avatar = '';
  }

  const linkedin = raw?.linkedin !== undefined ? raw.linkedin : (isDemoAlex ? 'https://linkedin.com' : '');
  const github = raw?.github !== undefined ? raw.github : (isDemoAlex ? 'https://github.com' : '');
  const portfolio = raw?.portfolio !== undefined ? raw.portfolio : (isDemoAlex ? 'https://alexmorgan.dev' : '');
  const workExperience = Array.isArray(raw?.workExperience) ? raw.workExperience : [];
  const certifications = Array.isArray(raw?.certifications) ? raw.certifications : [];
  const projects = Array.isArray(raw?.projects) ? raw.projects : [];
  const technicalSkills = Array.isArray(raw?.technicalSkills) ? raw.technicalSkills : [];

  return {
    name,
    email,
    employeeNumber,
    department,
    phone,
    designation,
    experienceYears,
    yop,
    country,
    location,
    bio,
    avatar,
    linkedin,
    github,
    portfolio,
    workExperience,
    certifications,
    projects,
    technicalSkills,
    userSavedCustomProfile: userSavedCustomProfile || isDemoAlex
  };
};

const EmployeeProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const activeUser = getActiveUser();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const [profile, setProfile] = useState(() => {
    const saved = getUserData('profile', null);
    const userSkills = getUserData('skills', []) || [];
    const clean = sanitizeProfile(saved, activeUser);
    clean.technicalSkills = userSkills;
    return clean;
  });

  const [formData, setFormData] = useState({ ...profile });

  useEffect(() => {
    fetchProfileData();
    const handleSkillsUpdate = () => {
      const currentSkills = getUserData('skills', []) || [];
      setProfile(prev => ({ ...prev, technicalSkills: currentSkills }));
    };
    window.addEventListener('skillsUpdated', handleSkillsUpdate);
    return () => {
      window.removeEventListener('skillsUpdated', handleSkillsUpdate);
    };
  }, []);

  const fetchProfileData = async () => {
    try {
      const saved = getUserData('profile', null);
      const userSkills = getUserData('skills', []) || [];

      if (saved && (saved.userSavedCustomProfile || saved.customProfileSet)) {
        const cleanSaved = sanitizeProfile(saved, activeUser);
        cleanSaved.technicalSkills = userSkills;
        setProfile(cleanSaved);
        setFormData(cleanSaved);
        setLoading(false);
        return;
      }

      let mergedData = sanitizeProfile(saved, activeUser);
      mergedData.technicalSkills = userSkills;

      try {
        const response = await profileService.getProfile();
        if (response.data) {
          mergedData = sanitizeProfile({
            ...mergedData,
            ...response.data,
            fullName: response.data.fullName || response.data.name || mergedData.name,
            experienceYears: response.data.experienceYears || response.data.experience_years || mergedData.experienceYears
          }, activeUser);
          mergedData.technicalSkills = userSkills;
        }
      } catch (err) {
        console.log('Profile API note:', err);
      }

      setProfile(mergedData);
      setFormData(mergedData);
      setUserData('profile', mergedData);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        const updated = { ...formData, avatar: dataUrl, userSavedCustomProfile: true };
        setProfile(updated);
        setFormData(updated);
        setUserData('profile', updated);
        updateUser({ avatar: dataUrl });
        window.dispatchEvent(new Event('profileUpdated'));
        showGlobalToast('Profile photo updated successfully.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = async () => {
    const updated = { ...formData, avatar: '', userSavedCustomProfile: true };
    setProfile(updated);
    setFormData(updated);
    setUserData('profile', updated);
    updateUser({ avatar: '' });
    window.dispatchEvent(new Event('profileUpdated'));

    try {
      await profileService.updateProfile({ avatar: '' });
    } catch (err) {
      console.log('Remove avatar API fallback:', err);
    }

    showGlobalToast('Profile photo removed.', 'info');
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    const updatedObj = {
      ...formData,
      experienceYears: Number(formData.experienceYears) || 0,
      userSavedCustomProfile: true,
      customProfileSet: true
    };

    setProfile(updatedObj);
    setFormData(updatedObj);
    setUserData('profile', updatedObj);

    try {
      await profileService.updateProfile({
        ...updatedObj,
        experience_years: updatedObj.experienceYears,
      });
    } catch (err) {
      console.log('Profile update API fallback:', err);
    }

    updateUser({
      name: updatedObj.name,
      email: updatedObj.email,
      avatar: updatedObj.avatar,
      department: updatedObj.department,
      designation: updatedObj.designation,
      phone: updatedObj.phone,
      experienceYears: updatedObj.experienceYears,
      employeeNumber: updatedObj.employeeNumber,
      yop: updatedObj.yop,
      country: updatedObj.country,
      location: updatedObj.location
    });

    window.dispatchEvent(new Event('profileUpdated'));
    setIsEditing(false);
    showGlobalToast('Profile settings updated successfully!', 'success');
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Page Header */}
      <div>
        <PageHeader 
          title="Profile" 
          subtitle="Manage your professional background, work experience, certifications, and technical skills."
        />
      </div>

      {/* Success Notification */}
      {message && (
        <div className="flex items-center gap-2 px-4 py-3 bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700/60 text-teal-800 dark:text-teal-200 rounded-xl text-sm font-semibold animate-fade-in shadow-sm">
          <UserCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          {message}
        </div>
      )}

      <Card className="p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xl relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group shrink-0">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name || 'Profile'}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl"
              />
            ) : (
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-slate-100 dark:bg-slate-800/80 border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl select-none">
                <User className="w-10 h-10 text-slate-400 dark:text-slate-500 stroke-[1.5]" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1">No Photo</span>
              </div>
            )}
            <label className="absolute inset-0 bg-slate-950/60 rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-xs font-bold gap-1">
              <Camera className="w-5 h-5" />
              <span>Upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                  {profile.name || activeUser?.username || 'Employee'}
                  <CheckCircle2 className="w-5 h-5 text-teal-500 fill-teal-500/20" />
                </h1>
                <p className="text-xs font-bold text-teal-600 dark:text-teal-400 mt-1">
                  {profile.designation ? `${profile.designation} • ` : ''}{profile.department || 'General'}
                </p>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer self-center sm:self-auto"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2 self-center sm:self-auto">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-teal-600/20"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {profile.bio || 'No professional bio added yet. Click "Edit Profile" to add your summary.'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              {profile.employeeNumber && (
                <span className="flex items-center gap-1.5"><Hash className="w-4 h-4 text-teal-500" /> Emp ID: {profile.employeeNumber}</span>
              )}
              {profile.yop && (
                <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-purple-500" /> YOP: {profile.yop}</span>
              )}
              {profile.country && (
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-indigo-500" /> {profile.country}</span>
              )}
              {profile.location && (
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-rose-500" /> {profile.location}</span>
              )}
              {profile.email && (
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-teal-500" /> {profile.email}</span>
              )}
              {profile.phone && (
                <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-cyan-500" /> {profile.phone}</span>
              )}
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-emerald-500" /> {profile.experienceYears ? `${profile.experienceYears} Years Exp` : '0 Years Exp'}</span>
            </div>
          </div>
        </div>
      </Card>

      {isEditing ? (
        <Card className="p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xl space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Edit Profile Information
          </h3>

          {/* Profile Photo Controls Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Avatar Preview"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-700">
                  <User className="w-6 h-6 stroke-[1.5]" />
                  <span className="text-[9px] font-bold">No Photo</span>
                </div>
              )}
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Profile Photo</h4>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Upload your personal headshot. Photo remains blank until you choose a file.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-teal-600/20 transition-all">
                <Camera className="w-4 h-4" />
                <span>{formData.avatar ? 'Change Photo' : 'Upload Photo'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
              {formData.avatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="px-3 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Varsha"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Employee Number / ID</label>
                <input
                  type="text"
                  value={formData.employeeNumber}
                  onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                  placeholder="e.g. EMP-1024"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Job Designation / Title</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Frontend Developer"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Engineering / AI & DS"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Year of Passing (YOP)</label>
                <input
                  type="number"
                  min="1970"
                  max="2035"
                  value={formData.yop}
                  onChange={(e) => setFormData({ ...formData, yop: e.target.value })}
                  placeholder="e.g. 2024"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +1 555-0192"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. India / United States"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Location / City</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Bangalore / New York"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Professional Bio</label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Write a short summary about your background and engineering interests..."
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">LinkedIn Profile</label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">GitHub Profile</label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Personal Portfolio</label>
                <input
                  type="text"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  placeholder="https://myportfolio.com"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/20 cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-lg space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <div className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg">
                  <Briefcase className="w-4 h-4" />
                </div>
                Work Experience
              </h3>

              <div className="space-y-3.5">
                {profile.workExperience && profile.workExperience.length > 0 ? (
                  profile.workExperience.map((exp, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{exp.role}</h4>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{exp.duration}</span>
                      </div>
                      <p className="text-xs font-bold text-teal-600 dark:text-teal-400">{exp.company}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">{exp.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-800 text-center py-6">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      No work experience added yet.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-lg space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <div className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg">
                  <GraduationCap className="w-4 h-4" />
                </div>
                Education & Certifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {profile.certifications && profile.certifications.length > 0 ? (
                  profile.certifications.map((cert) => (
                    <div key={cert.id} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                      <div className="flex items-start gap-2">
                        <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                          {cert.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium pl-6">
                        {cert.issuer} • {cert.issueDate}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-800 text-center py-6">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      No certifications recorded yet.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-lg space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <div className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg">
                  <Globe className="w-4 h-4" />
                </div>
                Featured Projects
              </h3>

              <div className="space-y-3.5">
                {profile.projects && profile.projects.length > 0 ? (
                  profile.projects.map((proj) => (
                    <div key={proj.id} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{proj.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{proj.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.technologies.map((tech, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold border border-teal-500/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-800 text-center py-6">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      No featured projects recorded yet.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-lg space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Technical Skills
              </h3>

              <div className="space-y-3.5">
                {profile.technicalSkills && profile.technicalSkills.length > 0 ? (
                  profile.technicalSkills.map((sk) => (
                    <div key={sk.id || sk.name} className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-800 dark:text-slate-200">{sk.name}</span>
                        <span className="text-teal-600 dark:text-teal-400">{sk.proficiencyPercentage || 70}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
                        <div
                          className="h-full bg-gradient-to-r from-teal-600 to-emerald-400 rounded-full"
                          style={{ width: `${sk.proficiencyPercentage || 70}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      No technical skills recorded yet.
                    </p>
                    <button
                      onClick={() => navigate(ROUTES.SKILLS)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Skills
                    </button>
                  </div>
                )}
              </div>
            </Card>

            {/* Social Profiles */}
            <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-lg space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Social Profiles
              </h3>

              <div className="space-y-2.5 text-xs font-bold">
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500/40 transition-all"
                  >
                    <Share2 className="w-4 h-4 text-teal-500" />
                    <span className="truncate">LinkedIn Profile</span>
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500/40 transition-all"
                  >
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span className="truncate">GitHub Profile</span>
                  </a>
                )}
                {profile.portfolio && (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500/40 transition-all"
                  >
                    <Globe className="w-4 h-4 text-teal-500" />
                    <span className="truncate">Personal Portfolio</span>
                  </a>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;