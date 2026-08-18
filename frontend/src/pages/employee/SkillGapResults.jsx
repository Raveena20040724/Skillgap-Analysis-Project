import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ArrowRight, Target, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import PageHeader from '../../components/common/PageHeader';
import { skillGapService } from '../../services/skillGapService';
import { ROUTES } from '../../constants/routes';

// Dummy fallback data until backend is ready
const DUMMY_DATA = [
  { skill: 'React.js & Frontend Architecture', currentLevel: 88, requiredLevel: 95 },
  { skill: 'Python & Django Framework', currentLevel: 74, requiredLevel: 85 },
  { skill: 'PostgreSQL & Database Optimization', currentLevel: 75, requiredLevel: 90 },
  { skill: 'Machine Learning Fundamentals', currentLevel: 45, requiredLevel: 75 },
  { skill: 'Docker & CI/CD Pipelines', currentLevel: 62, requiredLevel: 85 },
  { skill: 'AWS Cloud Infrastructure', currentLevel: 68, requiredLevel: 85 },
];

const SkillGapResults = () => {
  const navigate = useNavigate();
  const [gapData, setGapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillGaps();
  }, []);

  const fetchSkillGaps = async () => {
    try {
      const response = await skillGapService.getSkillGapResults();
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setGapData(response.data);
      } else {
        // Read custom_user_skills if available
        const savedCustom = localStorage.getItem('custom_user_skills');
        if (savedCustom) {
          const customSkills = JSON.parse(savedCustom);
          const mapped = customSkills.map(sk => ({
            skill: sk.name,
            currentLevel: sk.proficiencyPercentage || 70,
            requiredLevel: sk.proficiencyPercentage >= 80 ? 95 : 85,
          }));
          setGapData(mapped);
        } else {
          setGapData(DUMMY_DATA);
        }
      }
    } catch (error) {
      console.error('Failed to fetch skill gaps:', error);
      setGapData(DUMMY_DATA);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const gapsWithDiff = (gapData.length ? gapData : DUMMY_DATA).map((item) => ({
    ...item,
    gap: Math.max(0, item.requiredLevel - item.currentLevel),
  }));

  const biggestGap = [...gapsWithDiff].sort((a, b) => b.gap - a.gap)[0] || gapsWithDiff[0];
  const strongestSkill = [...gapsWithDiff].sort((a, b) => a.gap - b.gap)[0] || gapsWithDiff[0];

  const handleTakeAssessmentForGap = (skillName) => {
    let domainId = 'ml_ai';
    const sLow = skillName.toLowerCase();
    if (sLow.includes('machine learning') || sLow.includes('ai')) domainId = 'ml_ai';
    else if (sLow.includes('docker') || sLow.includes('devops')) domainId = 'docker_devops';
    else if (sLow.includes('aws') || sLow.includes('cloud')) domainId = 'aws_cloud';
    else if (sLow.includes('sql') || sLow.includes('postgres') || sLow.includes('database')) domainId = 'sql_database';
    else if (sLow.includes('react') || sLow.includes('frontend') || sLow.includes('typescript')) domainId = 'react_arch';

    navigate(`${ROUTES.SKILL_ASSESSMENT}?domain=${domainId}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <PageHeader 
        title="Skill Gap Analysis Results" 
        subtitle="Compare your active skill ratings against target role benchmarks and resolve competency deficits."
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-rose-500 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Biggest Diagnosed Competency Gap
              </p>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/10 text-rose-600 border border-rose-500/20">
                Priority 1
              </span>
            </div>
            <p className="text-xl font-black mt-2 text-slate-900 dark:text-white">{biggestGap.skill}</p>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
              Deficit: <span className="font-extrabold text-rose-600 dark:text-rose-400">-{biggestGap.gap}%</span> (Current {biggestGap.currentLevel}% → Required {biggestGap.requiredLevel}%)
            </p>
          </div>

          <button
            onClick={() => handleTakeAssessmentForGap(biggestGap.skill)}
            className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer w-full sm:w-auto"
          >
            <Target className="w-4 h-4" />
            <span>Take Targeted Assessment for this Gap</span>
          </button>
        </Card>

        <Card className="border-l-4 border-emerald-500 p-6 flex flex-col justify-between space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Strongest Role Competency
            </p>
            <p className="text-xl font-black mt-2 text-slate-900 dark:text-white">{strongestSkill.skill}</p>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
              Rating: <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{strongestSkill.currentLevel}%</span> (Target Benchmark: {strongestSkill.requiredLevel}%)
            </p>
          </div>

          <button
            onClick={() => navigate(ROUTES.SKILLS_MANAGEMENT)}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer w-full sm:w-auto"
          >
            <span>View Full Skills Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Card>
      </div>

      {/* Bar chart comparing current vs required */}
      <Card className="p-6">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">Current vs Required Skill Competency Levels</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={gapsWithDiff} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
            <XAxis dataKey="skill" angle={-15} textAnchor="end" interval={0} height={60} stroke="#94a3b8" fontSize={11} />
            <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Bar dataKey="currentLevel" fill="#2563eb" name="Current Proficiency (%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="requiredLevel" fill="#0d9488" name="Required Target Level (%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Detailed Skill Competency Breakdown</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Click any row action to launch targeted assessment</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700/80 text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-3 px-3">Skill Competency</th>
                <th className="py-3 px-3">Current Level</th>
                <th className="py-3 px-3">Target Required</th>
                <th className="py-3 px-3">Identified Deficit</th>
                <th className="py-3 px-3 text-right">Targeted Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {gapsWithDiff.map((item) => (
                <tr key={item.skill} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors duration-150">
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">{item.skill}</td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-semibold">{item.currentLevel}%</td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-semibold">{item.requiredLevel}%</td>
                  <td className={`py-3.5 px-3 font-black ${item.gap >= 20 ? 'text-rose-600 dark:text-rose-400' : item.gap > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {item.gap > 0 ? `-${item.gap}% Deficit` : 'Benchmark Met'}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    {item.gap > 0 ? (
                      <button
                        onClick={() => handleTakeAssessmentForGap(item.skill)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                      >
                        <span>Take Assessment</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SkillGapResults;