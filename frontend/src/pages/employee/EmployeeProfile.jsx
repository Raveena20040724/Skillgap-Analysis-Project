import { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_PROFILE = {
  name: 'Alex Morgan',
  designation: 'Senior Frontend Developer',
  department: 'Engineering',
  bio: 'Passionate Web Architect focusing on React, TypeScript, scalable UI design systems, and AI-assisted workflow optimization.',
  location: 'San Francisco, CA',
  email: 'alex.morgan@company.com',
  phone: '+1 (555) 234-5678',
  experienceYears: 5,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  linkedin: 'https://linkedin.com',
  github: 'https://github.com',
  portfolio: 'https://alexmorgan.dev',
  workExperience: [
    {
      role: 'Senior Frontend Developer',
      company: 'TechCorp Global',
      duration: '2023 - Present',
      description: 'Leading frontend team building high-throughput SaaS web platforms.',
    },
    {
      role: 'UI Developer',
      company: 'Innovate Solutions',
      duration: '2021 - 2023',
      description: 'Engineered responsive Web APIs and SPA applications.',
    },
  ],
  certifications: [
    {
      id: 'c1',
      title: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      issueDate: 'Nov 2024',
    },
    {
      id: 'c2',
      title: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      issueDate: 'Jan 2023',
    },
  ],
  projects: [
    {
      id: 'p1',
      title: 'Enterprise Design System v3',
      description: 'Built unified component library serving 40+ engineering teams.',
      technologies: ['React', 'TypeScript', 'Tailwind', 'Storybook'],
    },
    {
      id: 'p2',
      title: 'AI Code Assistant Dashboard',
      description: 'Internal tool for developer telemetry and code quality benchmarks.',
      technologies: ['React', 'Python API', 'Recharts'],
    },
  ],
  technicalSkills: [
    { id: 's1', name: 'React', proficiencyPercentage: 92 },
    { id: 's2', name: 'TypeScript', proficiencyPercentage: 88 },
    { id: 's3', name: 'Node.js', proficiencyPercentage: 70 },
    { id: 's4', name: 'GraphQL', proficiencyPercentage: 65 },
    { id: 's5', name: 'Tailwind CSS', proficiencyPercentage: 95 },
    { id: 's6', name: 'Docker', proficiencyPercentage: 45 },
    { id: 's7', name: 'AWS Cloud', proficiencyPercentage: 40 },
    { id: 's8', name: 'PyTorch / GenAI', proficiencyPercentage: 55 },
  ],
};

const EmployeeProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const [profile, setProfile] = useState({
    ...DEFAULT_PROFILE,
    name: user?.name || user?.username || DEFAULT_PROFILE.name,
    email: user?.email || localStorage.getItem('userEmail') || DEFAULT_PROFILE.email,
    department: user?.department || localStorage.getItem('userDepartment') || DEFAULT_PROFILE.department,
    designation: user?.designation || localStorage.getItem('userDesignation') || DEFAULT_PROFILE.designation,
    phone: localStorage.getItem('userPhone') || DEFAULT_PROFILE.phone,
    experienceYears: localStorage.getItem('userExperienceYears') ? Number(localStorage.getItem('userExperienceYears')) : DEFAULT_PROFILE.experienceYears,
    avatar: localStorage.getItem('userAvatar') || user?.avatar || DEFAULT_PROFILE.avatar,
  });

  const [formData, setFormData] = useState({ ...profile });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await profileService.getProfile();
      if (response.data) {
        const storedAvatar = localStorage.getItem('userAvatar');
        const storedPhone = localStorage.getItem('userPhone');
        const storedDept = localStorage.getItem('userDepartment');
        const storedDesig = localStorage.getItem('userDesignation');
        const storedEmail = localStorage.getItem('userEmail');
        const storedExp = localStorage.getItem('userExperienceYears');

        const updatedData = {
          ...DEFAULT_PROFILE,
          name: response.data.fullName || response.data.name || user?.name || DEFAULT_PROFILE.name,
          email: response.data.email || storedEmail || user?.email || DEFAULT_PROFILE.email,
          phone: response.data.phone || storedPhone || DEFAULT_PROFILE.phone,
          department: response.data.department || storedDept || DEFAULT_PROFILE.department,
          designation: response.data.designation || storedDesig || DEFAULT_PROFILE.designation,
          location: response.data.location || DEFAULT_PROFILE.location,
          experienceYears: response.data.experienceYears || response.data.experience_years || (storedExp ? Number(storedExp) : DEFAULT_PROFILE.experienceYears),
          bio: response.data.bio || DEFAULT_PROFILE.bio,
          avatar: storedAvatar || response.data.avatar || DEFAULT_PROFILE.avatar,
          linkedin: response.data.linkedin || DEFAULT_PROFILE.linkedin,
          github: response.data.github || DEFAULT_PROFILE.github,
          portfolio: response.data.portfolio || DEFAULT_PROFILE.portfolio,
        };

        setProfile(updatedData);
        setFormData(updatedData);
      }
    } catch (err) {
      console.log('Using initial fallback profile data:', err);
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
        setProfile((prev) => ({ ...prev, avatar: dataUrl }));
        setFormData((prev) => ({ ...prev, avatar: dataUrl }));
        localStorage.setItem('userAvatar', dataUrl);
        updateUser({ avatar: dataUrl });
        setMessage('Profile photo updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await profileService.updateProfile({
        ...formData,
        experience_years: formData.experienceYears,
      });
    } catch (err) {
      console.log('Profile update API fallback:', err);
    }

    localStorage.setItem('userPhone', formData.phone || '');
    localStorage.setItem('userDepartment', formData.department || '');
    localStorage.setItem('userDesignation', formData.designation || '');
    localStorage.setItem('userEmail', formData.email || '');
    localStorage.setItem('userExperienceYears', String(formData.experienceYears || 3));

    setProfile({ ...formData });
    updateUser({
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
      department: formData.department,
      designation: formData.designation,
    });

    setIsEditing(false);
    setMessage('✅ Profile information updated successfully!');
    setTimeout(() => setMessage(''), 3500);
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
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-200 rounded-xl text-sm font-semibold animate-fade-in shadow-sm">
          <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          {message}
        </div>
      )}

      {/* Hero Profile Banner Card */}
      <Card className="p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xl relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with Camera Hover Overlay */}
          <div className="relative group shrink-0">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl"
            />
            <label className="absolute inset-0 bg-slate-950/60 rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-xs font-bold gap-1">
              <Camera className="w-5 h-5" />
              <span>Upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                  {profile.name}
                  <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                </h1>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {profile.designation} • {profile.department}
                </p>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer self-center sm:self-auto"
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
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {profile.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 text-xs font-medium text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-rose-500" /> {profile.location}</span>
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-blue-500" /> {profile.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-emerald-500" /> {profile.phone}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-purple-500" /> {profile.experienceYears} Years Exp</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Grid or Edit Form */}
      {isEditing ? (
        <Card className="p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xl space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Edit Profile Information
          </h3>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Work Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Professional Bio</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">LinkedIn Profile</label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">GitHub Profile</label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Personal Portfolio</label>
                <input
                  type="text"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
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
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column (2 Cols): Experience, Education & Certifications, Projects */}
          <div className="lg:col-span-2 space-y-6">
            {/* Work Experience */}
            <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-lg space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg">
                  <Briefcase className="w-4 h-4" />
                </div>
                Work Experience
              </h3>

              <div className="space-y-3.5">
                {profile.workExperience.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{exp.role}</h4>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{exp.duration}</span>
                    </div>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{exp.company}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Education & Certifications */}
            <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-lg space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <GraduationCap className="w-4 h-4" />
                </div>
                Education & Certifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {profile.certifications.map((cert) => (
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
                ))}
              </div>
            </Card>

            {/* Featured Projects */}
            <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-lg space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg">
                  <Globe className="w-4 h-4" />
                </div>
                Featured Projects
              </h3>

              <div className="space-y-3.5">
                {profile.projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{proj.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map((tech, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column (1 Col): Technical Skills & Social Profiles */}
          <div className="space-y-6">
            {/* Technical Skills Progress Bars */}
            <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-lg space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Technical Skills
              </h3>

              <div className="space-y-3.5">
                {profile.technicalSkills.map((sk) => (
                  <div key={sk.id} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-800 dark:text-slate-200">{sk.name}</span>
                      <span className="text-blue-600 dark:text-blue-400">{sk.proficiencyPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                        style={{ width: `${sk.proficiencyPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
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
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/40 transition-all"
                  >
                    <Share2 className="w-4 h-4 text-blue-500" />
                    <span className="truncate">LinkedIn Profile</span>
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/40 transition-all"
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
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
                  >
                    <Globe className="w-4 h-4 text-emerald-500" />
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