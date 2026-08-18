import { useState } from 'react';
import { 
  BarChart2, 
  Clock, 
  BookOpen, 
  Award, 
  CheckSquare, 
  TrendingUp, 
  Calendar 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';

// Data for Line Chart (Jan - Jul)
const SKILL_GROWTH_DATA = [
  { month: 'Jan', score: 65 },
  { month: 'Feb', score: 68 },
  { month: 'Mar', score: 73 },
  { month: 'Apr', score: 76 },
  { month: 'May', score: 80 },
  { month: 'Jun', score: 82 },
  { month: 'Jul', score: 86 },
];

// Data for Bar Chart (Mon - Sun)
const WEEKLY_HOURS_DATA = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.0 },
  { day: 'Wed', hours: 0.0 },
  { day: 'Thu', hours: 4.0 },
  { day: 'Fri', hours: 2.0 },
  { day: 'Sat', hours: 1.0 },
  { day: 'Sun', hours: 0.5 },
];

// Custom Bar Tooltip matching the photo tooltip style (white popup box)
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-slate-900 p-2.5 rounded-xl shadow-xl border border-slate-200 text-xs font-bold text-center">
        <p className="text-slate-500 font-semibold text-[11px]">{label}</p>
        <p className="text-emerald-600 font-extrabold text-sm mt-0.5">
          hours : {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

// Custom Line Tooltip
const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-bold text-center">
        <p className="text-slate-400 font-semibold text-[11px]">{label}</p>
        <p className="text-blue-400 font-extrabold text-sm mt-0.5">
          Score : {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const ProgressTracking = () => {
  const [activeIndex, setActiveIndex] = useState(1); // Tuesday active bar

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <BarChart2 className="w-8 h-8 text-purple-600 dark:text-purple-400 stroke-[2.2]" />
          Employee Learning Progress & Growth Tracking
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Historical analysis of your skill acquisition rate, weekly learning commitment, and assessment benchmark scores.
        </p>
      </div>

      {/* Top 4 Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Learning Hours */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-lg flex items-center gap-3.5 transition-colors overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider truncate">
              Total Learning Hours
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white truncate">
              114 hrs
            </p>
          </div>
        </div>

        {/* Card 2: Completed Courses */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-lg flex items-center gap-3.5 transition-colors overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider truncate">
              Completed Courses
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white truncate">
              6 Courses
            </p>
          </div>
        </div>

        {/* Card 3: Certificates Earned */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-lg flex items-center gap-3.5 transition-colors overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider truncate">
              Certificates Earned
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white truncate">
              4 Certs
            </p>
          </div>
        </div>

        {/* Card 4: Avg Assessment Score */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-lg flex items-center gap-3.5 transition-colors overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider truncate">
              Avg Assessment Score
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white truncate">
              91.6%
            </p>
          </div>
        </div>
      </div>

      {/* Two Large Chart Panels (Matching Photo) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart Card: Skill Growth Evolution (Line Chart) */}
        <div className="p-6 md:p-8 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Skill Growth Evolution (Line Chart)
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Overall readiness index progression Jan - Jul
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SKILL_GROWTH_DATA} margin={{ top: 15, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  fontWeight={600} 
                  tickLine={false} 
                  axisLine={{ stroke: '#475569' }} 
                />
                <YAxis 
                  domain={[50, 100]} 
                  ticks={[50, 65, 80, 100]} 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  fontWeight={600} 
                  tickLine={false} 
                  axisLine={{ stroke: '#475569' }} 
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3.5}
                  dot={{ fill: '#3b82f6', r: 5, strokeWidth: 3, stroke: '#ffffff' }}
                  activeDot={{ r: 7, strokeWidth: 3, stroke: '#ffffff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart Card: Weekly Learning Hours Log (Bar Chart) */}
        <div className="p-6 md:p-8 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Weekly Learning Hours Log (Bar Chart)
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Daily time spent on courses & practice tasks
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={WEEKLY_HOURS_DATA} 
                margin={{ top: 15, right: 20, left: -20, bottom: 0 }}
                onMouseMove={(state) => {
                  if (state.isTooltipActive) setActiveIndex(state.activeTooltipIndex);
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  fontWeight={600} 
                  tickLine={false} 
                  axisLine={{ stroke: '#475569' }} 
                />
                <YAxis 
                  domain={[0, 4]} 
                  ticks={[0, 1, 2, 3, 4]} 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  fontWeight={600} 
                  tickLine={false} 
                  axisLine={{ stroke: '#475569' }} 
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
                  {WEEKLY_HOURS_DATA.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === activeIndex ? '#10b981' : '#10b981'} 
                      opacity={index === activeIndex ? 1 : 0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;