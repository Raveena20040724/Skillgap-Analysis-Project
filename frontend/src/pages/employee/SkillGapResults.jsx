import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Target, Sparkles, CheckCircle2, AlertTriangle, CloudUpload, Award } from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import PageHeader from '../../components/common/PageHeader';
import { skillGapService } from '../../services/skillGapService';
import { ROUTES } from '../../constants/routes';
import { resumeService } from '../../services/resumeService';
import { getUserData, setUserData, getActiveUser } from '../../utils/userStorage';

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

const SkillGapResults = () => {
  const navigate = useNavigate();
  const [gapData, setGapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillGaps();
    window.addEventListener('skillsUpdated', fetchSkillGaps);
    return () => {
      window.removeEventListener('skillsUpdated', fetchSkillGaps);
    };
  }, []);

  const fetchSkillGaps = async () => {
    try {
      const activeUser = getActiveUser();
      const combinedSkills = filterOutDummySkills(getUserData('skills', []) || []);
      let resumeInfo = getUserData('resume_info', null);

      if (combinedSkills.length > 0) {
        const mapped = combinedSkills.map(sk => ({
          skill: sk.name,
          currentLevel: sk.proficiencyPercentage || 70,
          requiredLevel: (sk.proficiencyPercentage || 70) >= 80 ? 95 : 85,
        }));
        setGapData(mapped);
        setLoading(false);
        return;
      }

      setGapData([]);
    } catch (error) {
      console.log('Skill gap results load note:', error);
      setGapData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const gapsWithDiff = gapData.map((item) => ({
    ...item,
    gap: Math.max(0, item.requiredLevel - item.currentLevel),
  }));

  const biggestGap = [...gapsWithDiff].sort((a, b) => b.gap - a.gap)[0] || null;
  const strongestSkill = [...gapsWithDiff].sort((a, b) => a.gap - b.gap)[0] || null;

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

      {gapsWithDiff.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed border-teal-200 dark:border-teal-800/60 rounded-3xl bg-slate-50/50 dark:bg-slate-900/40 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-inner">
            <Target className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              No Skill Gap Telemetry Available
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload your resume to automatically extract your skills or add your competencies in Skills Management to generate your Current vs Required Skill Competency Levels.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate(ROUTES.RESUME_UPLOAD)}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-600/25 transition-all cursor-pointer"
            >
              <CloudUpload className="w-4 h-4" />
              Upload Resume
            </button>
            <button
              onClick={() => navigate(ROUTES.SKILLS)}
              className="px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-teal-600 dark:text-teal-300 border border-teal-200 dark:border-teal-700 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              Add Skills Manually
            </button>
          </div>
        </Card>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {biggestGap && (
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
            )}

            {strongestSkill && (
              <Card className="border-l-4 border-teal-500 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Strongest Role Competency
                  </p>
                  <p className="text-xl font-black mt-2 text-slate-900 dark:text-white">{strongestSkill.skill}</p>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
                    Rating: <span className="font-extrabold text-teal-600 dark:text-teal-400">{strongestSkill.currentLevel}%</span> (Target Benchmark: {strongestSkill.requiredLevel}%)
                  </p>
                </div>

                <button
                  onClick={() => navigate(ROUTES.SKILLS)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer w-full sm:w-auto"
                >
                  <span>View Full Skills Inventory</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Card>
            )}
          </div>

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
                      <td className={`py-3.5 px-3 font-black ${item.gap >= 20 ? 'text-rose-600 dark:text-rose-400' : item.gap > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-teal-600 dark:text-teal-400'}`}>
                        {item.gap > 0 ? `-${item.gap}% Deficit` : 'Benchmark Met'}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {item.gap > 0 ? (
                          <button
                            onClick={() => handleTakeAssessmentForGap(item.skill)}
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-teal-500/20"
                          >
                            <span>Take Assessment</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 inline-flex items-center gap-1">
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
        </>
      )}
    </div>
  );
};

export default SkillGapResults;