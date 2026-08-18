import { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  CheckSquare, 
  BarChart2, 
  PieChart as PieChartIcon, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { hrService } from '../../services/hrService';

// Data for Department Skill Readiness Bar Chart
const DEFAULT_DEPARTMENT_READINESS = [
  { department: 'Engineering', readiness: 88 },
  { department: 'Product', readiness: 84 },
  { department: 'Design', readiness: 78 },
  { department: 'DevOps', readiness: 92 },
  { department: 'Data Science', readiness: 81 },
];

// Data for Organization Skill Taxonomy Distribution Pie Chart
const DEFAULT_TAXONOMY_DISTRIBUTION = [
  { name: 'Frontend', value: 35, color: '#3b82f6' },
  { name: 'Backend', value: 25, color: '#10b981' },
  { name: 'Cloud/DevOps', value: 20, color: '#6366f1' },
  { name: 'AI/ML', value: 12, color: '#f59e0b' },
  { name: 'UI/UX', value: 8, color: '#06b6d4' },
];

// Custom Bar Tooltip
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold">
        <p className="text-slate-400 font-semibold">{label}</p>
        <p className="text-indigo-400 font-extrabold text-sm mt-1">
          Readiness: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

// Custom Pie Tooltip
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold">
        <p className="font-extrabold text-sm" style={{ color: payload[0].payload.color }}>
          {payload[0].name}: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const HrDashboard = () => {
  const [stats, setStats] = useState({
    totalWorkforce: 342,
    avgReadiness: 83.4,
    departmentsCount: 5,
    completionRate: 91,
    deptReadiness: DEFAULT_DEPARTMENT_READINESS,
    taxonomyDistribution: DEFAULT_TAXONOMY_DISTRIBUTION,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await hrService.getOverviewStats();
      if (res.data) {
        setStats({
          totalWorkforce: res.data.total_workforce || 342,
          avgReadiness: res.data.avg_readiness || 83.4,
          departmentsCount: (res.data.department_readiness && res.data.department_readiness.length) || 5,
          completionRate: 91,
          deptReadiness: res.data.department_readiness || DEFAULT_DEPARTMENT_READINESS,
          taxonomyDistribution: res.data.taxonomy_distribution || DEFAULT_TAXONOMY_DISTRIBUTION,
        });
      }
    } catch (err) {
      console.log('Using default HR overview telemetry.', err);
    }
  };
  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Top Hero Gradient Banner (Matching Photo) */}
      <div className="p-8 md:p-10 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white rounded-3xl shadow-2xl space-y-3 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 transform pointer-events-none"></div>

        <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/30 inline-block">
          HR Command & Workforce Analytics
        </span>

        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
          Organization Skill Readiness Portal
        </h1>

        <p className="text-xs md:text-sm font-medium text-indigo-100 max-w-3xl leading-relaxed">
          Real-time talent telemetry across {stats.departmentsCount} departments and {stats.totalWorkforce} active employees. Average skill readiness index is <strong className="text-emerald-300 font-black">{stats.avgReadiness}%</strong>.
        </p>
      </div>

      {/* 4 Stat Summary Cards (Matching Photo) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Card 1: Total Workforce */}
        <div className="p-6 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl flex items-start justify-between gap-4 transition-colors">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Total Workforce
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.totalWorkforce}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <span className="text-emerald-500 font-black">+12 this month</span>
              <span>• Active Employees</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        {/* Card 2: Departments */}
        <div className="p-6 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl flex items-start justify-between gap-4 transition-colors">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Departments
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.departmentsCount}
            </p>
            <p className="text-xs font-semibold text-slate-400">
              Monitored teams
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-purple-500" />
          </div>
        </div>

        {/* Card 3: Workforce Readiness */}
        <div className="p-6 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl flex items-start justify-between gap-4 transition-colors">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Workforce Readiness
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.avgReadiness}%
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <span className="text-emerald-500 font-black">+4.2% YoY</span>
              <span>• Target skill match</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        {/* Card 4: Assessment Completion */}
        <div className="p-6 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl flex items-start justify-between gap-4 transition-colors">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Assessment Completion
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.completionRate}%
            </p>
            <p className="text-xs font-semibold text-slate-400">
              Monthly quota
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <CheckSquare className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Two Large Chart Panels (Matching Photo) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart Card: Department Skill Readiness Score (Bar Chart) */}
        <div className="p-6 md:p-8 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-500" />
              Department Skill Readiness Score (Bar Chart)
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Average skill benchmark score per department
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stats.deptReadiness} 
                margin={{ top: 15, right: 20, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                <XAxis 
                  dataKey="department" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  fontWeight={600} 
                  tickLine={false} 
                  axisLine={{ stroke: '#475569' }} 
                />
                <YAxis 
                  domain={[0, 100]} 
                  ticks={[0, 25, 50, 75, 100]} 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  fontWeight={600} 
                  tickLine={false} 
                  axisLine={{ stroke: '#475569' }} 
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="readiness" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart Card: Organization Skill Taxonomy Distribution (Pie Chart) */}
        <div className="p-6 md:p-8 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-emerald-500" />
              Organization Skill Taxonomy Distribution (Pie Chart)
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Domain representation across engineering & product
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.taxonomyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.taxonomyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;