import { useState, useEffect } from 'react';
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
  ChevronDown 
} from 'react-bootstrap-icons';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';

// Overview stat cards data
const STAT_CARDS = [
  {
    id: 1,
    title: 'Completed Skills',
    value: '12',
    subtext: '+3 acquired this month',
    bg: 'bg-rose-100/90 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800/60 backdrop-blur-md shadow-md shadow-rose-500/5',
    iconBg: 'bg-rose-200/90 text-rose-900 border-rose-300 dark:bg-rose-900/60 dark:text-rose-300 dark:border-rose-700/50',
    titleColor: 'text-rose-950 dark:text-rose-200 font-extrabold',
    valueColor: 'text-slate-950 dark:text-white font-black',
    subtextColor: 'text-rose-900 dark:text-rose-300 font-bold',
    icon: Check2Circle,
  },
  {
    id: 2,
    title: 'In Progress Skills',
    value: '8',
    subtext: 'Active courses & pathways',
    bg: 'bg-teal-100/90 border-teal-300 dark:bg-teal-950/40 dark:border-teal-800/60 backdrop-blur-md shadow-md shadow-teal-500/5',
    iconBg: 'bg-teal-200/90 text-teal-900 border-teal-300 dark:bg-teal-900/60 dark:text-teal-300 dark:border-teal-700/50',
    titleColor: 'text-teal-950 dark:text-teal-200 font-extrabold',
    valueColor: 'text-slate-950 dark:text-white font-black',
    subtextColor: 'text-teal-900 dark:text-teal-300 font-bold',
    icon: ArrowRepeat,
  },
  {
    id: 3,
    title: 'Identified Skill Gaps',
    value: '4',
    subtext: 'Gaps in target roles',
    bg: 'bg-indigo-100/90 border-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-800/60 backdrop-blur-md shadow-md shadow-indigo-500/5',
    iconBg: 'bg-indigo-200/90 text-indigo-900 border-indigo-300 dark:bg-indigo-900/60 dark:text-indigo-300 dark:border-indigo-700/50',
    titleColor: 'text-indigo-950 dark:text-indigo-200 font-extrabold',
    valueColor: 'text-slate-950 dark:text-white font-black',
    subtextColor: 'text-indigo-900 dark:text-indigo-300 font-bold',
    icon: Clock,
  },
  {
    id: 4,
    title: 'Overall Rating',
    value: '88%',
    subtext: 'Top 15% percentile',
    bg: 'bg-purple-100/90 border-purple-300 dark:bg-purple-950/40 dark:border-purple-800/60 backdrop-blur-md shadow-md shadow-purple-500/5',
    iconBg: 'bg-purple-200/90 text-purple-900 border-purple-300 dark:bg-purple-900/60 dark:text-purple-300 dark:border-purple-700/50',
    titleColor: 'text-purple-950 dark:text-purple-200 font-extrabold',
    valueColor: 'text-slate-950 dark:text-white font-black',
    subtextColor: 'text-purple-900 dark:text-purple-300 font-bold',
    icon: ListCheck,
  },
];

// Quarterly multi-bar chart data
const QUARTERLY_DATA = [
  { quarter: 'Q1', completed: 65, ongoing: 15, skillGap: 45 },
  { quarter: 'Q2', completed: 55, ongoing: 30, skillGap: 25 },
  { quarter: 'Q3', completed: 42, ongoing: 70, skillGap: 20 },
  { quarter: 'Q4', completed: 50, ongoing: 15, skillGap: 72 },
];

// Donut chart performance data
const DONUT_DATA = [
  { name: 'Mastered Skills', value: 55, color: '#6366f1' },
  { name: 'In Progress', value: 30, color: '#ec4899' },
  { name: 'Skill Gaps', value: 15, color: '#14b8a6' },
];

const EmployeeDashboard = () => {
  const [selectedYear, setSelectedYear] = useState('2026');

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader 
        title="Employee Dashboard" 
        subtitle="Overview of your career progress, active recommendations, and skill growth." 
      />

      {/* 1. Overview Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Overview</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((card) => {
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
          {/* Left Column (8/12): Grouped Multi-Bar Chart */}
          <Card className="lg:col-span-8 p-6 flex flex-col justify-between">
            {/* Custom Bar Legend Header */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">On-going</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Skill Gap</span>
              </div>
            </div>

            {/* Bar Chart Container */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={QUARTERLY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} 
                />
                <Bar dataKey="completed" fill="#3b82f6" name="Completed" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="ongoing" fill="#10b981" name="On-going" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="skillGap" fill="#f59e0b" name="Skill Gap" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Right Column (4/12): Performance Donut Chart */}
          <Card className="lg:col-span-4 p-6 flex flex-col items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white self-start mb-2">Last 30 Days Performance</h3>

            {/* Donut Chart */}
            <div className="w-full flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={DONUT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {DONUT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Donut Legend Below */}
            <div className="w-full space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {DONUT_DATA.map((item) => (
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