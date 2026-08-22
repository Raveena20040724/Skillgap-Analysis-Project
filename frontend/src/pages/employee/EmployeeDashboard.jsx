import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { 
  Check2Circle, 
  ArrowRepeat, 
  Clock, 
  ListCheck, 
  ChevronDown,
  CloudUpload,
  PatchCheck
} from 'react-bootstrap-icons';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import { getUserData, getActiveUser } from '../../utils/userStorage';
import { ROUTES } from '../../constants/routes';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const activeUser = getActiveUser();
  const [selectedYear, setSelectedYear] = useState('2026');
  const [hasSkills, setHasSkills] = useState(false);
  const [metrics, setMetrics] = useState({
    completedSkills: 0,
    inProgressSkills: 0,
    skillGaps: 0,
    overallRating: 0,
  });

  const [donutData, setDonutData] = useState([
    { name: 'Mastered Skills', value: 0, color: '#0d9488' },
    { name: 'In Progress', value: 0, color: '#06b6d4' },
    { name: 'Skill Gaps', value: 0, color: '#f43f5e' },
  ]);

  const [quarterlyData, setQuarterlyData] = useState([
    { quarter: 'Q1', completed: 0, ongoing: 0, skillGap: 0 },
    { quarter: 'Q2', completed: 0, ongoing: 0, skillGap: 0 },
    { quarter: 'Q3', completed: 0, ongoing: 0, skillGap: 0 },
    { quarter: 'Q4', completed: 0, ongoing: 0, skillGap: 0 },
  ]);

  useEffect(() => {
    const loadRealMetrics = () => {
      try {
        const savedSkills = getUserData('skills', []) || [];
        const resumeSkills = getUserData('resume_skills', []) || [];

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

        const rawSkills = [...savedSkills, ...resumeSkills];
        const seen = new Set();
        const skills = rawSkills.filter(s => {
          if (!s || !s.name) return false;
          const nameLower = s.name.toLowerCase().trim();
          if (DUMMY_SKILL_NAMES.has(nameLower)) return false;
          if (seen.has(nameLower)) return false;
          seen.add(nameLower);
          return true;
        });

        if (skills && skills.length > 0) {
          setHasSkills(true);
          const completed = skills.filter(s => (s.proficiencyPercentage || 0) >= 80).length;
          const inProgress = skills.filter(s => (s.proficiencyPercentage || 0) >= 70 && (s.proficiencyPercentage || 0) < 80).length;
          const gaps = skills.filter(s => (s.proficiencyPercentage || 0) < 70).length;
          const totalProf = skills.reduce((acc, s) => acc + (s.proficiencyPercentage || 0), 0);
          const avgRating = Math.round(totalProf / skills.length);

          setMetrics({
            completedSkills: completed,
            inProgressSkills: inProgress,
            skillGaps: gaps,
            overallRating: avgRating,
          });

          const total = Math.max(1, skills.length);
          const masteredPct = Math.round((completed / total) * 100);
          const ongoingPct = Math.round((inProgress / total) * 100);
          const gapsPct = Math.max(0, 100 - masteredPct - ongoingPct);

          setDonutData([
            { name: 'Mastered Skills', value: masteredPct, color: '#0d9488' },
            { name: 'In Progress', value: ongoingPct, color: '#06b6d4' },
            { name: 'Skill Gaps', value: gapsPct, color: '#f43f5e' },
          ]);

          // Calculate real technical domain competency & assessment benchmarks
          const assessments = getUserData('assessment_results', []) || [];
          const DOMAINS = [
            { key: 'Programming', label: 'Programming' },
            { key: 'UI/UX', label: 'UI/UX Design' },
            { key: 'Database', label: 'Database' },
            { key: 'Cloud', label: 'Cloud' },
            { key: 'AI', label: 'AI & Data' },
          ];

          const domainCalculated = DOMAINS.map(dObj => {
            const domainSkills = skills.filter(s =>
              (s.category || '').toLowerCase().includes(dObj.key.toLowerCase()) ||
              (s.name || '').toLowerCase().includes(dObj.key.toLowerCase())
            );
            const domainAssessments = assessments.filter(a =>
              (a.skillName || '').toLowerCase().includes(dObj.key.toLowerCase())
            );

            const avgProf = domainSkills.length > 0
              ? Math.round(domainSkills.reduce((acc, curr) => acc + (curr.proficiencyPercentage || 0), 0) / domainSkills.length)
              : 0;

            const avgScore = domainAssessments.length > 0
              ? Math.round(domainAssessments.reduce((acc, curr) => acc + (curr.score || 0), 0) / domainAssessments.length)
              : 0;

            return {
              domain: dObj.label,
              proficiency: avgProf,
              assessmentScore: avgScore,
              targetGoal: (avgProf > 0 || avgScore > 0) ? 85 : 0
            };
          });

          setQuarterlyData(domainCalculated);
        } else {
          // Zero state for new user
          setHasSkills(false);
          setMetrics({
            completedSkills: 0,
            inProgressSkills: 0,
            skillGaps: 0,
            overallRating: 0,
          });
          setDonutData([
            { name: 'Mastered Skills', value: 0, color: '#0d9488' },
            { name: 'In Progress', value: 0, color: '#06b6d4' },
            { name: 'Skill Gaps', value: 0, color: '#f43f5e' },
          ]);
          setQuarterlyData([
            { domain: 'Programming', proficiency: 0, assessmentScore: 0, targetGoal: 0 },
            { domain: 'UI/UX Design', proficiency: 0, assessmentScore: 0, targetGoal: 0 },
            { domain: 'Database', proficiency: 0, assessmentScore: 0, targetGoal: 0 },
            { domain: 'Cloud', proficiency: 0, assessmentScore: 0, targetGoal: 0 },
            { domain: 'AI & Data', proficiency: 0, assessmentScore: 0, targetGoal: 0 },
          ]);
        }
      } catch (err) {
        console.error('Error loading dashboard metrics:', err);
      }
    };

    loadRealMetrics();
    window.addEventListener('skillsUpdated', loadRealMetrics);
    window.addEventListener('userDataChanged', loadRealMetrics);
    return () => {
      window.removeEventListener('skillsUpdated', loadRealMetrics);
      window.removeEventListener('userDataChanged', loadRealMetrics);
    };
  }, []);

  const statCards = [
    {
      id: 1,
      title: 'Completed Skills',
      value: String(metrics.completedSkills),
      subtext: 'High mastery competencies',
      bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/60 shadow-sm',
      iconBg: 'bg-teal-600 text-white shadow-md shadow-teal-500/20',
      titleColor: 'text-teal-950 dark:text-teal-200 font-extrabold',
      valueColor: 'text-slate-950 dark:text-white font-black',
      subtextColor: 'text-teal-700 dark:text-teal-300 font-bold',
      icon: Check2Circle,
    },
    {
      id: 2,
      title: 'In Progress Skills',
      value: String(metrics.inProgressSkills),
      subtext: 'Active learning pathways',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/60 shadow-sm',
      iconBg: 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20',
      titleColor: 'text-cyan-950 dark:text-cyan-200 font-extrabold',
      valueColor: 'text-slate-950 dark:text-white font-black',
      subtextColor: 'text-cyan-700 dark:text-cyan-300 font-bold',
      icon: ArrowRepeat,
    },
    {
      id: 3,
      title: 'Identified Skill Gaps',
      value: String(metrics.skillGaps),
      subtext: 'Targeted deficit areas',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 shadow-sm',
      iconBg: 'bg-rose-600 text-white shadow-md shadow-rose-500/20',
      titleColor: 'text-rose-950 dark:text-rose-200 font-extrabold',
      valueColor: 'text-slate-950 dark:text-white font-black',
      subtextColor: 'text-rose-700 dark:text-rose-300 font-bold',
      icon: Clock,
    },
    {
      id: 4,
      title: 'Overall Rating',
      value: `${metrics.overallRating}%`,
      subtext: 'Average benchmark score',
      bg: 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm',
      iconBg: 'bg-teal-600 text-white shadow-md shadow-teal-500/20',
      titleColor: 'text-slate-950 dark:text-slate-200 font-extrabold',
      valueColor: 'text-slate-950 dark:text-white font-black',
      subtextColor: 'text-slate-600 dark:text-slate-400 font-bold',
      icon: ListCheck,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader 
        title="Employee Dashboard" 
        subtitle="Overview of your career progress, active recommendations, and skill growth." 
      />

      {/* Onboarding Welcome Prompt for Clean / Zero State */}
      {!hasSkills && (
        <Card className="p-6 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-indigo-500/10 border-2 border-dashed border-teal-300 dark:border-teal-800/60 rounded-3xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <PatchCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                Welcome to your SkillGap Profile, {activeUser?.name || activeUser?.username || 'Employee'}!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                You haven't uploaded a resume or added any skills yet. Upload your resume to extract competencies automatically or take an AI skill benchmark assessment to generate real-time metrics and career pathways.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => navigate(ROUTES.RESUME_UPLOAD)}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-teal-600/25 transition-all cursor-pointer"
              >
                <CloudUpload className="w-4 h-4" />
                Upload Resume
              </button>
              <button
                onClick={() => navigate(ROUTES.SKILL_ASSESSMENT)}
                className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-teal-600 dark:text-teal-300 border border-teal-200 dark:border-teal-700 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer"
              >
                <PatchCheck className="w-4 h-4" />
                Take Assessment
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* 1. Overview Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Overview</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.id} 
                className={`p-5 rounded-2xl border transition-all duration-200 hover:scale-[1.02] ${card.bg}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-xs ${card.titleColor}`}>{card.title}</span>
                </div>
                
                <p className={`text-3xl tracking-tight mb-1 ${card.valueColor}`}>{card.value}</p>
                <p className={`text-xs ${card.subtextColor}`}>{card.subtext}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Detailed Reports Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Detailed reports</h2>
          
          {/* Year Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400" size={14} />
          </div>
        </div>

        {/* Charts Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8/12): Domain Competency & Assessment Benchmarks Bar Chart */}
          <Card className="lg:col-span-8 p-6 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Technical Domain Competency & Assessment Benchmarks
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time comparison of current proficiency %, test scores %, and role target goals
                </p>
              </div>

              {/* Custom Bar Legend Header */}
              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#0d9488]"></span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Proficiency (%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#06b6d4]"></span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Assessment (%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#6366f1]"></span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Target (85%)</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Container */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                <XAxis dataKey="domain" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} 
                />
                <Bar dataKey="proficiency" fill="#0d9488" name="Current Proficiency (%)" radius={[6, 6, 0, 0]} maxBarSize={28} />
                <Bar dataKey="assessmentScore" fill="#06b6d4" name="Assessment Score (%)" radius={[6, 6, 0, 0]} maxBarSize={28} />
                <Bar dataKey="targetGoal" fill="#6366f1" name="Target Benchmark Goal (%)" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Right Column (4/12): Performance Donut Chart */}
          <Card className="lg:col-span-4 p-6 flex flex-col items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white self-start mb-2">Skill Health Distribution</h3>

            {/* Donut Chart */}
            <div className="w-full flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Donut Legend Below */}
            <div className="w-full space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {donutData.map((item) => (
                <div key={item.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default EmployeeDashboard;