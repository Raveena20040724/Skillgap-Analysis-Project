import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Layers, 
  ArrowRight, 
  Award,
  Sparkles,
  ChevronRight,
  XCircle,
  Play
} from 'lucide-react';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import { getUserData, getActiveUser } from '../../utils/userStorage';

const BASE_STAGES = [
  {
    id: 1,
    stageLevel: 'BEGINNER STAGE',
    stageLevelBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30',
    duration: '4 Weeks',
    title: 'Foundation & Core Fundamentals',
    courses: [
      'Modern TypeScript & JavaScript Fundamentals',
      'Frontend Architecture Essentials'
    ],
    projects: [
      'Responsive Component Library'
    ],
    credentials: 'Core Engineering Competency Certificate'
  },
  {
    id: 2,
    stageLevel: 'INTERMEDIATE STAGE',
    stageLevelBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    duration: '6 Weeks',
    title: 'State Architecture & Performance',
    courses: [
      'State Management & Modern APIs',
      'Web Vitals & Performance Optimization'
    ],
    projects: [
      'High-Throughput Analytics Dashboard'
    ],
    credentials: 'Senior Developer Benchmark Certificate'
  },
  {
    id: 3,
    stageLevel: 'ADVANCED STAGE',
    stageLevelBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    duration: '8 Weeks',
    title: 'Micro-Frontends & Cloud Scaling',
    courses: [
      'Cloud Architecture & Micro-Services',
      'Enterprise Design System Engineering'
    ],
    projects: [
      'Enterprise Multi-App Design System v3'
    ],
    credentials: 'System Architect Certification'
  },
  {
    id: 4,
    stageLevel: 'EXPERT STAGE',
    stageLevelBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    duration: '6 Weeks',
    title: 'AI Integration & Advanced Telemetry',
    courses: [
      'Client-Side AI & Vector Embeddings',
      'AI Automation Pipelines'
    ],
    projects: [
      'In-Browser AI Assistant Extension'
    ],
    credentials: 'AI Application Specialist'
  }
];

const LearningPath = () => {
  const navigate = useNavigate();
  const activeUser = getActiveUser();
  const [selectedStage, setSelectedStage] = useState(null);
  const [stages, setStages] = useState([]);

  const computeStages = () => {
    const userSkills = getUserData('skills', []) || [];
    const enrolledCourses = getUserData('enrolled_courses', []) || [];
    const assessments = getUserData('assessment_results', []) || [];

    const skillCount = userSkills.length;
    const enrolledCount = enrolledCourses.length;
    const testCount = assessments.length;

    // Dynamically calculate stage status based on user actions
    let completedStagesCount = 0;
    if (skillCount >= 6 || testCount >= 2) completedStagesCount = 2;
    else if (skillCount >= 2 || enrolledCount >= 1 || testCount >= 1) completedStagesCount = 1;

    const dynamicStages = BASE_STAGES.map((stg, idx) => {
      let status = 'upcoming';
      let statusLabel = 'Upcoming';
      let statusBg = 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/30';

      if (idx < completedStagesCount) {
        status = 'completed';
        statusLabel = '✓ Stage Completed';
        statusBg = 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30';
      } else if (idx === completedStagesCount) {
        status = 'in-progress';
        statusLabel = 'In Progress';
        statusBg = 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30';
      }

      return {
        ...stg,
        status,
        statusLabel,
        statusBg
      };
    });

    setStages(dynamicStages);
  };

  useEffect(() => {
    computeStages();
    window.addEventListener('skillsUpdated', computeStages);
    window.addEventListener('coursesUpdated', computeStages);
    window.addEventListener('assessmentsUpdated', computeStages);
    window.addEventListener('userDataChanged', computeStages);
    return () => {
      window.removeEventListener('skillsUpdated', computeStages);
      window.removeEventListener('coursesUpdated', computeStages);
      window.removeEventListener('assessmentsUpdated', computeStages);
      window.removeEventListener('userDataChanged', computeStages);
    };
  }, []);

  const completedCount = stages.filter((s) => s.status === 'completed').length;
  const progressPercentage = stages.length > 0 ? Math.round((completedCount / stages.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Top Banner Box Matching Photo */}
      <div className="p-8 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 inline-block">
            Dynamic AI Roadmap
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Learning Path for Principal Frontend Architect
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Estimated Total Duration: <strong className="text-slate-800 dark:text-slate-200">6 Months</strong> • Completed Steps: <strong className="text-slate-800 dark:text-slate-200">{completedCount}/{stages.length}</strong>
          </p>
        </div>

        {/* Path Completion Box */}
        <div className="p-5 bg-slate-50 dark:bg-[#0f1524] border border-slate-200 dark:border-slate-800 rounded-2xl text-center min-w-[170px] shrink-0">
          <div className="text-3xl font-black text-teal-600 dark:text-teal-400 leading-none">
            {progressPercentage}%
          </div>
          <div className="text-[10px] font-black tracking-wider uppercase text-slate-400 dark:text-slate-400 mt-1">
            PATH COMPLETION
          </div>
        </div>
      </div>

      {/* Vertical Timeline Roadmap */}
      <div className="relative pl-3 md:pl-6 space-y-8">
        {/* Timeline Connecting Vertical Line */}
        <div className="absolute left-[22px] md:left-[34px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800 z-0"></div>

        {stages.map((stage) => {
          const isCompleted = stage.status === 'completed';
          const isInProgress = stage.status === 'in-progress';

          return (
            <div key={stage.id} className="relative flex items-start gap-4 md:gap-6 z-10">
              {/* Timeline Marker Node Icon */}
              <div className="shrink-0 mt-6">
                {isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center text-teal-500 shadow-md shadow-teal-500/20">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                ) : isInProgress ? (
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center text-teal-500 shadow-md shadow-teal-500/20 animate-pulse">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  </div>
                )}
              </div>

              {/* Stage Card Box */}
              <div
                className={`flex-1 p-6 md:p-8 bg-white dark:bg-[#161f33] text-slate-900 dark:text-white border rounded-3xl shadow-xl transition-all duration-300 space-y-6 ${
                  isInProgress
                    ? 'border-teal-500/50 shadow-teal-500/10 ring-2 ring-teal-500/20'
                    : 'border-slate-200/90 dark:border-slate-800'
                }`}
              >
                {/* Stage Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${stage.stageLevelBg}`}>
                      {stage.stageLevel}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {stage.duration}
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${stage.statusBg}`}>
                    {stage.statusLabel}
                  </span>
                </div>

                {/* Stage Title */}
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                  {stage.title}
                </h2>

                {/* Content Columns: Key Courses & Real-World Projects */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Key Courses Column */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase text-slate-400 dark:text-slate-400 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-teal-500" />
                      Key Courses
                    </h4>
                    <ul className="space-y-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {stage.courses.map((course, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Real-World Projects Column */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase text-slate-400 dark:text-slate-400 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-500" />
                      Real-World Projects
                    </h4>
                    <ul className="space-y-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {stage.projects.map((project, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Row: Credentials & View Modules Link */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Target Credentials: <strong className="text-slate-900 dark:text-white">{stage.credentials}</strong>
                  </div>

                  <button
                    onClick={() => setSelectedStage(stage)}
                    className="text-xs font-extrabold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Step Modules</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage Step Modules Modal */}
      {selectedStage && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${selectedStage.stageLevelBg}`}>
                  {selectedStage.stageLevel}
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mt-2">
                  {selectedStage.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStage(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Curriculum Courses</h4>
                <div className="space-y-2 mt-2">
                  {selectedStage.courses.map((c, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>{c}</span>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold uppercase">3 Modules</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Hands-on Capstone Project</h4>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 mt-2">
                  {selectedStage.projects[0]}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setSelectedStage(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedStage(null);
                  navigate(ROUTES.COURSE_RECOMMENDATIONS);
                }}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPath;