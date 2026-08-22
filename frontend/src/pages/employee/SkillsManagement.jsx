import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { 
  Zap, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  X,
  Award,
  TrendingUp,
  Layers,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  CloudUpload
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { skillsService } from '../../services/skillsService';
import { showGlobalToast } from '../../components/common/ToastContainer';
import { getUserData, setUserData, addActiveUserNotification } from '../../utils/userStorage';

const DEFAULT_CATEGORIES = [
  'Programming',
  'Database',
  'Cloud',
  'AI',
  'UI/UX',
  'DevOps',
  'Testing',
  'Communication',
  'Leadership',
  'Soft Skills'
];

const DUMMY_SKILL_NAMES = new Set([
  'react.js & frontend',
  'python & django',
  'postgresql & sql',
  'aws cloud infrastructure',
  'docker & ci/cd pipelines',
  'docker & ci/cd automation',
  'ui/ux design systems',
  'machine learning fundamentals',
  'technical team leadership',
  'python & django framework',
  'postgresql & database optimization',
  'rest & graphql apis',
  'tailwind css & ui design systems',
  'typescript & static analysis',
  'react.js & frontend architecture',
  'javascript (es6+)',
  'typescript & type safety',
  'html5 & css3 responsive design',
  'tailwind css & component systems',
  'restful api integration'
]);

const filterOutDummySkills = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter(s => {
    if (!s || !s.name) return false;
    return !DUMMY_SKILL_NAMES.has(s.name.toLowerCase().trim());
  });
};

const SkillsManagement = () => {
  const navigate = useNavigate();
  const hasResume = !!getUserData('resume_info', null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [notification, setNotification] = useState('');

  // Category addition support
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const categoryScrollRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming',
    level: 'Intermediate',
    yearsOfExperience: 2,
    proficiencyPercentage: 70,
    verified: true,
  });

  useEffect(() => {
    fetchSkills();

    const handleSkillsUpdated = () => {
      fetchSkills();
    };

    window.addEventListener('skillsUpdated', handleSkillsUpdated);
    return () => window.removeEventListener('skillsUpdated', handleSkillsUpdated);
  }, []);

  const fetchSkills = async () => {
    try {
      // Single source of truth for active skills
      const rawSkills = getUserData('skills', []) || [];
      const cleanSkills = filterOutDummySkills(rawSkills);
      setSkills(cleanSkills);
    } catch (error) {
      console.log('Skills load note:', error);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  // Derive dynamic list of all categories from default + active skills
  const dynamicCategories = [
    'All',
    ...Array.from(
      new Set([
        ...DEFAULT_CATEGORIES,
        ...skills.map((s) => s.category).filter(Boolean),
      ])
    ),
  ];

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    setFormData({
      name: '',
      category: 'Programming',
      level: 'Intermediate',
      yearsOfExperience: 2,
      proficiencyPercentage: 70,
      verified: true,
    });
    setIsModalOpen(true);
  };

  const [skillToDelete, setSkillToDelete] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    const isCustom = !DEFAULT_CATEGORIES.includes(skill.category);
    setIsCustomCategory(isCustom);
    if (isCustom) {
      setCustomCategoryInput(skill.category || '');
    }
    setFormData({
      name: skill.name,
      category: skill.category || 'Programming',
      level: skill.level || 'Intermediate',
      yearsOfExperience: skill.yearsOfExperience || 1,
      proficiencyPercentage: skill.proficiencyPercentage || 70,
      verified: skill.verified ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (skill) => {
    setSkillToDelete(skill);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!skillToDelete) return;
    const id = skillToDelete.id;
    const skillName = skillToDelete.name?.toLowerCase().trim();
    try {
      await skillsService.deleteSkill(id);
    } catch (err) {
      // Handled locally
    }
    const updated = skills.filter((sk) => sk.id !== id && sk.name?.toLowerCase().trim() !== skillName);
    setSkills(updated);
    setUserData('skills', updated);

    // Also remove from user's resume cache
    try {
      const resumeSkills = getUserData('resume_skills', []) || [];
      const updatedResumeSkills = resumeSkills.filter(sk => sk.id !== id && sk.name?.toLowerCase().trim() !== skillName);
      setUserData('resume_skills', updatedResumeSkills);
    } catch (e) {
      console.warn('Resume cache clear error:', e);
    }

    window.dispatchEvent(new Event('skillsUpdated'));
    showGlobalToast(`Skill "${skillToDelete.name}" removed successfully.`, 'delete');
    setIsDeleteConfirmOpen(false);
    setSkillToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const finalCategory = isCustomCategory 
      ? (customCategoryInput.trim() || 'General')
      : formData.category;

    const updatedFormData = {
      ...formData,
      category: finalCategory,
    };

    let nextSkills = [];
    if (editingSkill) {
      try {
        await skillsService.updateSkill(editingSkill.id, updatedFormData);
      } catch (err) {
        // Handled locally
      }
      nextSkills = skills.map((sk) => (sk.id === editingSkill.id ? { ...sk, ...updatedFormData } : sk));
      setSkills(nextSkills);
      showGlobalToast(`Updated "${formData.name}" skill competency.`, 'success');
    } else {
      const newSkillObj = {
        id: String(Date.now()),
        ...updatedFormData,
      };
      try {
        const response = await skillsService.addSkill(updatedFormData);
        if (response.data?.id) newSkillObj.id = response.data.id;
      } catch (err) {
        // Handled locally
      }
      nextSkills = [newSkillObj, ...skills];
      setSkills(nextSkills);

      // Add real-time notification
      addActiveUserNotification({
        title: '✨ New Competency Added',
        message: `Added "${formData.name}" (${finalCategory}) at ${formData.proficiencyPercentage || 70}% proficiency to your profile.`,
        category: 'Skill Growth',
        type: 'skill',
        severity: 'success',
        actionLabel: 'View Skills',
        link: '/employee/skills'
      });

      showGlobalToast(`Added "${formData.name}" under category "${finalCategory}".`, 'success');
    }

    setUserData('skills', nextSkills);
    window.dispatchEvent(new Event('skillsUpdated'));
    setIsModalOpen(false);
  };

  // Filter logic
  const filteredSkills = skills.filter((sk) => {
    const matchesSearch =
      sk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sk.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sk.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || sk.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Calculate statistics
  const totalSkillsCount = skills.length;
  const advancedCount = skills.filter(
    (s) => s.level === 'Advanced' || s.level === 'Expert' || s.proficiencyPercentage >= 80
  ).length;
  const avgProficiency =
    totalSkillsCount > 0
      ? Math.round(
          skills.reduce((acc, curr) => acc + (curr.proficiencyPercentage || 70), 0) /
            totalSkillsCount
        )
      : 0;
  const categoriesCount = new Set(skills.map((s) => s.category)).size;

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-600/10 via-emerald-600/10 to-teal-500/10 dark:from-teal-900/30 dark:via-emerald-950/40 dark:to-teal-900/20 p-6 rounded-3xl border border-teal-500/20 dark:border-teal-500/30 shadow-md">
        <div>
          <PageHeader
            title={
              <span className="flex items-center gap-2.5 text-slate-900 dark:text-white font-extrabold text-2xl">
                <Zap className="w-7 h-7 text-teal-600 dark:text-teal-400 fill-teal-500/20 animate-pulse" />
                Skills Inventory & Dynamic Proficiency Management
              </span>
            }
            subtitle="Manage competencies in real-time. Changes instantly recalculate your AI Skill Gap & Career Match %."
          />
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          Add New Skill
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="flex items-center gap-2 px-4 py-3 bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700/60 text-teal-800 dark:text-teal-200 rounded-xl text-sm font-semibold animate-fade-in shadow-sm">
          <Check className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          {notification}
        </div>
      )}

      {!hasResume ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto border border-dashed border-teal-500/40 bg-teal-500/5 shadow-md my-8">
          <div className="w-16 h-16 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <CloudUpload className="w-8 h-8 animate-bounce" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">No Resume Uploaded Yet</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
            Please upload your resume to extract, parse, and verify your skills and competencies. Skill management is locked until a resume is uploaded.
          </p>
          <Button onClick={() => navigate(ROUTES.RESUME_UPLOAD)} className="gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 shadow-lg shadow-teal-500/25">
            <CloudUpload className="w-4 h-4" />
            Upload Resume Now
          </Button>
        </Card>
      ) : (
        <>
          {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Skills</span>
            <div className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{totalSkillsCount}</p>
          <p className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 mt-1">Declared Competencies</p>
        </Card>

        <Card className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Advanced / Expert</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{advancedCount}</p>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">High Mastery Skills</p>
        </Card>

        <Card className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Proficiency</span>
            <div className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{avgProficiency}%</p>
          <p className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 mt-1">Overall Skill Score</p>
        </Card>

        <Card className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Domains</span>
            <div className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{categoriesCount}</p>
          <p className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 mt-1">Active Skill Categories</p>
        </Card>
      </div>

      {/* Filter & Search Toolbar */}
      <Card className="p-5 space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search skills (e.g. React, Python, AWS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Filter dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Level:
            </span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        {/* Dynamic Sideways Slider Categories Bar (No Scrollbar) */}
        <div className="relative flex items-center group">
          {/* Left Arrow Button */}
          <button
            onClick={() => scrollCategories('left')}
            title="Slide left"
            className="absolute left-0 z-10 p-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:scale-110 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Categories Container without visible scrollbar */}
          <div
            ref={categoryScrollRef}
            className="flex items-center gap-2 overflow-x-auto py-1 px-8 w-full scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {dynamicCategories.map((cat) => {
              const count =
                cat === 'All'
                  ? skills.length
                  : skills.filter((s) => s.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedCategory === cat
                        ? 'bg-teal-700 text-teal-100'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => scrollCategories('right')}
            title="Slide right"
            className="absolute right-0 z-10 p-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:scale-110 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </Card>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSkills.length === 0 ? (
          <Card className="col-span-full p-12 text-center border-dashed border-2 border-slate-300 dark:border-slate-800">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No matching skills found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                No skills match your search query "{searchQuery}" or category filter. Try clearing your filters or add a new skill.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedLevel('All');
                  }}
                >
                  Reset Filters
                </Button>
                <Button variant="primary" onClick={handleOpenAdd}>
                  Add Skill
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          filteredSkills.map((skill) => {
            const levelColorClass = 
              skill.level === 'Expert' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
              skill.level === 'Advanced' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20' :
              skill.level === 'Intermediate' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' :
              'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';

            return (
              <Card
                key={skill.id}
                className="p-5 border border-slate-200/80 dark:border-slate-800/80 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-200 group flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {skill.category}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1.5 leading-snug">
                        {skill.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => handleOpenEdit(skill)}
                        title="Edit Skill"
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(skill)}
                        title="Delete Skill"
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Proficiency Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500 dark:text-slate-400">Proficiency Score</span>
                      <span className="text-teal-600 dark:text-teal-400 font-extrabold">
                        {skill.proficiencyPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
                      <div
                        className="h-full bg-gradient-to-r from-teal-600 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${skill.proficiencyPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${levelColorClass}`}>
                      {skill.level}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">
                      {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'Year' : 'Years'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {skill.source === 'Resume' && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Resume
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-teal-500/20" /> Verified
                    </span>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-teal-500" />
                {editingSkill ? 'Edit Skill Competency' : 'Add New Skill Competency'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React.js, PyTorch, Kubernetes"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Category
                  </label>
                  {!isCustomCategory ? (
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === 'CUSTOM_NEW') {
                          setIsCustomCategory(true);
                          setCustomCategoryInput('');
                        } else {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    >
                      {dynamicCategories.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="CUSTOM_NEW" className="text-teal-600 font-bold">+ Create Custom Category...</option>
                    </select>
                  ) : (
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        required
                        placeholder="e.g. CyberSecurity"
                        value={customCategoryInput}
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                        className="w-full pl-3 pr-7 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-teal-500 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomCategory(false)}
                        title="Back to list"
                        className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Proficiency Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Proficiency ({formData.proficiencyPercentage}%)
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={formData.proficiencyPercentage}
                    onChange={(e) => setFormData({ ...formData, proficiencyPercentage: Number(e.target.value) })}
                    className="w-full accent-teal-600 mt-2 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {editingSkill ? 'Save Changes' : 'Add Skill'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Delete Skill"
        message={`Are you sure you want to remove "${skillToDelete?.name}" from your skills profile?`}
        confirmText="Yes, Delete Skill"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setSkillToDelete(null);
        }}
      />
    </>
  )}
</div>
);
};

export default SkillsManagement;
