import { useState, useEffect } from 'react';
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
import { getUserData } from '../../utils/userStorage';

const COURSE_HOURS_MAP = {
  1: 24, // AWS
  2: 18, // Docker & K8s
  3: 12, // AI
  4: 20, // TypeScript
  5: 16, // Data
  6: 14, // UI/UX
};

// Custom Bar Tooltip matching the photo tooltip style (white popup box)
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-center">
        <p className="text-slate-500 font-semibold text-[11px]">{label}</p>
        <p className="text-teal-600 dark:text-teal-400 font-extrabold text-sm mt-0.5">
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
        <p className="text-teal-400 font-extrabold text-sm mt-0.5">
          Score : {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const ProgressTracking = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [stats, setStats] = useState({
    learningHours: 0,
    completedCourses: 0,
    certificatesEarned: 0,
    avgScore: 0
  });
  const [skillGrowthData, setSkillGrowthData] = useState([]);
  const [weeklyHoursData, setWeeklyHoursData] = useState([]);

  useEffect(() => {
    const computeRealStats = () => {
      // 1. Read enrolled courses
      const enrolled = getUserData('enrolled_courses', []) || [];
      const totalHours = enrolled.reduce((acc, cId) => acc + (COURSE_HOURS_MAP[cId] || 16), 0);

      // 2. Read skills & assessment results
      const skills = getUserData('skills', []) || [];
      const assessmentResults = getUserData('assessment_results', []) || [];

      // Calculate average assessment / proficiency score
      let avgScore = 0;
      if (assessmentResults.length > 0) {
        const total = assessmentResults.reduce((acc, curr) => acc + (curr.score || 0), 0);
        avgScore = Number((total / assessmentResults.length).toFixed(1));
      } else if (skills.length > 0) {
        const total = skills.reduce((acc, curr) => acc + (curr.proficiencyPercentage || 0), 0);
        avgScore = Number((total / skills.length).toFixed(1));
      } else {
        avgScore = 0;
      }

      // Certificates earned (passed assessments or advanced verified skills)
      const passedAssessmentsCount = assessmentResults.filter(a => (a.score || 0) >= 80).length;
      const verifiedHighSkills = skills.filter(s => (s.proficiencyPercentage || 0) >= 80).length;
      const certificatesCount = passedAssessmentsCount + (verifiedHighSkills > 0 ? 1 : 0);

      const dailyAverage = totalHours > 0 ? (totalHours / 7).toFixed(1) : 0;

      setStats({
        learningHours: totalHours,
        completedCourses: enrolled.length > 1 ? enrolled.length - 1 : (enrolled.length === 1 ? 1 : 0),
        certificatesEarned: certificatesCount,
        avgScore: avgScore
      });

      // 3. Real-time calculation of Skill Growth Evolution (Jan - Jul) based strictly on real user records
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
      
      const realMonthlyGrowth = months.map((monthName, mIdx) => {
        // Filter real assessment results recorded on or before this month
        const validAssessments = assessmentResults.filter(a => {
          if (!a.date && !a.timestamp) return false;
          const aDate = new Date(a.date || a.timestamp);
          return aDate.getMonth() <= mIdx;
        });

        // Filter real skills added on or before this month
        const validSkills = skills.filter(s => {
          if (!s.createdAt && !s.date) return false;
          const sDate = new Date(s.createdAt || s.date);
          return sDate.getMonth() <= mIdx;
        });

        // If no user activities/assessments/skills occurred on or before this month, score is 0
        if (validAssessments.length === 0 && validSkills.length === 0) {
          // If this is the current active month and user has avgScore from current skills/assessments, display avgScore
          const currentMonthIdx = new Date().getMonth();
          if (mIdx === currentMonthIdx || (currentMonthIdx > 6 && mIdx === 6)) {
            return { month: monthName, score: Math.round(avgScore) };
          }
          return { month: monthName, score: 0 };
        }

        let totalScore = 0;
        let count = 0;

        if (validAssessments.length > 0) {
          totalScore += validAssessments.reduce((acc, curr) => acc + (curr.score || 0), 0);
          count += validAssessments.length;
        }

        if (validSkills.length > 0) {
          totalScore += validSkills.reduce((acc, curr) => acc + (curr.proficiencyPercentage || 0), 0);
          count += validSkills.length;
        }

        const computedScore = count > 0 ? Math.round(totalScore / count) : 0;
        return { month: monthName, score: computedScore };
      });

      setSkillGrowthData(realMonthlyGrowth);

      // 4. Calculate real active tab screen-time learning hours for Mon - Sun
      const activeSecondsMap = getUserData('active_weekly_seconds', {}) || {};
      const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      const realWeeklyHours = daysList.map((day) => {
        const sec = activeSecondsMap[day] || 0;
        const hoursDecimal = Number((sec / 3600).toFixed(2));
        return { day, hours: hoursDecimal };
      });

      const totalActiveSeconds = Object.values(activeSecondsMap).reduce((a, b) => a + (Number(b) || 0), 0);
      const activeLearningHours = Number((totalActiveSeconds / 3600).toFixed(1));

      setStats({
        learningHours: activeLearningHours > 0 ? activeLearningHours : (totalHours > 0 ? totalHours : 0),
        completedCourses: enrolled.length > 1 ? enrolled.length - 1 : (enrolled.length === 1 ? 1 : 0),
        certificatesEarned: certificatesCount,
        avgScore: avgScore
      });

      setWeeklyHoursData(realWeeklyHours);
    };

    computeRealStats();
    window.addEventListener('coursesUpdated', computeRealStats);
    window.addEventListener('skillsUpdated', computeRealStats);
    window.addEventListener('assessmentsUpdated', computeRealStats);
    window.addEventListener('activeTimeUpdated', computeRealStats);
    window.addEventListener('userDataChanged', computeRealStats);
    return () => {
      window.removeEventListener('coursesUpdated', computeRealStats);
      window.removeEventListener('skillsUpdated', computeRealStats);
      window.removeEventListener('assessmentsUpdated', computeRealStats);
      window.removeEventListener('activeTimeUpdated', computeRealStats);
      window.removeEventListener('userDataChanged', computeRealStats);
    };
  }, []);

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <BarChart2 className="w-8 h-8 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
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
          <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider truncate">
              Total Learning Hours
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white truncate">
              {stats.learningHours} hrs
            </p>
          </div>
        </div>

        {/* Card 2: Completed Courses */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-lg flex items-center gap-3.5 transition-colors overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider truncate">
              Completed Courses
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white truncate">
              {stats.completedCourses} {stats.completedCourses === 1 ? 'Course' : 'Courses'}
            </p>
          </div>
        </div>

        {/* Card 3: Certificates Earned */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-lg flex items-center gap-3.5 transition-colors overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider truncate">
              Certificates Earned
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white truncate">
              {stats.certificatesEarned} {stats.certificatesEarned === 1 ? 'Cert' : 'Certs'}
            </p>
          </div>
        </div>

        {/* Card 4: Avg Assessment Score */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-lg flex items-center gap-3.5 transition-colors overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider truncate">
              Avg Assessment Score
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white truncate">
              {stats.avgScore}%
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
              <TrendingUp className="w-5 h-5 text-teal-500" />
              Skill Growth Evolution (Line Chart)
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Overall readiness index progression Jan - Jul
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={skillGrowthData} margin={{ top: 15, right: 20, left: -20, bottom: 0 }}>
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
                  domain={[0, 100]} 
                  ticks={[0, 25, 50, 75, 100]} 
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
                  stroke="#8b5cf6"
                  strokeWidth={3.5}
                  dot={{ fill: '#8b5cf6', r: 5, strokeWidth: 3, stroke: '#ffffff' }}
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
              <Calendar className="w-5 h-5 text-teal-500" />
              Weekly Learning Hours Log (Bar Chart)
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Daily time spent on courses & practice tasks
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={weeklyHoursData} 
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
                  {weeklyHoursData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === activeIndex ? '#7c3aed' : '#8b5cf6'} 
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