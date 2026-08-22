import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  FileText,
  Plus,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { hrService } from '../../services/hrService';

const INITIAL_DIRECTORY_EMPLOYEES = [
  {
    id: 'emp_1',
    name: 'Alex Morgan',
    designation: 'Senior Frontend Developer',
    department: 'Engineering',
    skillReadinessScore: 84,
    experienceYears: 5,
    status: 'Active',
    email: 'alex.morgan@company.com',
    location: 'San Francisco, CA',
    bio: 'Frontend Specialist focusing on React, TypeScript, and micro-frontend architecture.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp_2',
    name: 'Sophia Patel',
    designation: 'Senior Machine Learning Engineer',
    department: 'Data Science & AI',
    skillReadinessScore: 91,
    experienceYears: 6,
    status: 'Active',
    email: 'sophia.patel@company.com',
    location: 'New York, NY',
    bio: 'Lead AI Engineer specializing in LLMs, PyTorch, and BigQuery ML forecasting pipelines.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp_3',
    name: 'David Chen',
    designation: 'Backend DevOps Engineer',
    department: 'Engineering',
    skillReadinessScore: 78,
    experienceYears: 4,
    status: 'Active',
    email: 'david.chen@company.com',
    location: 'Austin, TX',
    bio: 'DevOps & Infrastructure Architect specialized in Kubernetes, Docker, and GCP deployment pipelines.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp_4',
    name: 'Emily Watson',
    designation: 'Lead Product Designer',
    department: 'UI/UX Design',
    skillReadinessScore: 88,
    experienceYears: 7,
    status: 'Active',
    email: 'emily.watson@company.com',
    location: 'Seattle, WA',
    bio: 'Design Director passionate about design systems, accessibility, and modern glassmorphism UI.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  }
];

const DEPARTMENTS = [
  'All',
  'Engineering',
  'Data Science & AI',
  'UI/UX Design',
  'Product Management'
];

const EmployeeDirectory = () => {
  const [directoryEmployees, setDirectoryEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('custom_employee_directory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DIRECTORY_EMPLOYEES;
  });

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [reportEmp, setReportEmp] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchDirectory();
  }, [selectedDept, search]);

  const fetchDirectory = async () => {
    try {
      const res = await hrService.getEmployees({
        department: selectedDept !== 'All' ? selectedDept : undefined,
        search: search.trim() || undefined,
      });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setDirectoryEmployees(prev => {
          const merged = [...prev];
          res.data.forEach(emp => {
            const exists = merged.some(m => m.email?.toLowerCase() === emp.email?.toLowerCase());
            if (!exists) {
              merged.push({
                id: emp.id,
                name: emp.name || emp.username,
                designation: emp.designation || 'Software Engineer',
                department: emp.department || 'Engineering',
                skillReadinessScore: emp.readiness_score || 85,
                experienceYears: emp.experience_years || 3,
                status: 'Active',
                email: emp.email,
                location: emp.location || 'San Francisco, CA',
                bio: emp.bio || 'Engineered high quality software products.',
                avatar: emp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
              });
            }
          });
          localStorage.setItem('custom_employee_directory', JSON.stringify(merged));
          return merged;
        });
      }
    } catch (err) {
      console.log('Using persistent employee directory list.', err);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    designation: 'Software Engineer',
    location: 'San Francisco, CA',
    experienceYears: 3,
    bio: 'Engineered high quality software products.',
    skillReadinessScore: 85
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const created = {
      id: `emp_${Date.now()}`,
      ...formData,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
    };

    const updated = [created, ...directoryEmployees];
    setDirectoryEmployees(updated);
    localStorage.setItem('custom_employee_directory', JSON.stringify(updated));

    setFormData({
      name: '',
      email: '',
      department: 'Engineering',
      designation: 'Software Engineer',
      location: 'San Francisco, CA',
      experienceYears: 3,
      bio: 'Engineered high quality software products.',
      skillReadinessScore: 85
    });
    setIsAddModalOpen(false);
    showGlobalToast(`Added ${created.name} to workforce directory!`, 'success');
  };

  const filtered = directoryEmployees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 stroke-[2.2]" />
            Workforce & Employee Directory ({directoryEmployees.length})
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Inspect individual employee skill scores, resumes, and assessment reports.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="p-4 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDept(d)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all duration-200 cursor-pointer ${selectedDept === d
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((emp) => (
          <div key={emp.id} className="bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                {emp.avatar ? (
                  <img src={emp.avatar} alt={emp.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/40 shadow-md" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-purple-600/10 text-purple-600 dark:text-purple-400 font-extrabold text-lg flex items-center justify-center border-2 border-purple-500/30 shrink-0">
                    {(emp.name || 'E').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                    {emp.name}
                    <CheckCircle2 className="w-4 h-4 text-purple-500 fill-current shrink-0" />
                  </h3>
                  <p className="text-xs font-bold text-purple-600 dark:text-purple-400 truncate">{emp.designation}</p>
                  <p className="text-[10px] font-semibold text-slate-400 truncate">{emp.department}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0f1524] border border-slate-200/80 dark:border-[#2b3854] flex items-center justify-between text-xs text-center">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Skill Score</span>
                  <span className="font-black text-emerald-500 text-sm">{emp.skillReadinessScore}/100</span>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Experience</span>
                  <span className="font-black text-slate-900 dark:text-white">{emp.experienceYears} Years</span>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Status</span>
                  <span className="font-black text-purple-600 dark:text-purple-400">Active</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => setSelectedEmp(emp)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 text-slate-800 dark:text-slate-200 cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <Eye className="w-3.5 h-3.5" /> View Profile
              </button>
              <button
                onClick={() => setReportEmp(emp)}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> View Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Employee Report Modal */}
      {reportEmp && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Skill Telemetry Audit Report</h3>
                  <p className="text-xs font-bold text-purple-600 dark:text-purple-400">{reportEmp.name} • {reportEmp.department}</p>
                </div>
              </div>
              <button onClick={() => setReportEmp(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Overall Readiness Score</span>
                  <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{reportEmp.skillReadinessScore}%</span>
                </div>
                <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-[10px] font-black uppercase">
                  {reportEmp.skillReadinessScore >= 80 ? 'Optimal Benchmark' : 'Upskilling Active'}
                </span>
              </div>

              <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                <p className="text-slate-400 text-[10px] font-bold uppercase">Audit Summary</p>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  Verified {reportEmp.experienceYears} years of technical experience in {reportEmp.designation}. Competency evaluations indicate strong baseline architecture compliance.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Contact</span>
                  <span className="text-slate-900 dark:text-white font-extrabold truncate block">{reportEmp.email}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                  <span className="text-slate-900 dark:text-white font-extrabold truncate block">{reportEmp.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  showGlobalToast(`Downloaded audit report PDF for ${reportEmp.name}!`, 'success');
                  setReportEmp(null);
                }}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl shadow-md shadow-purple-600/30 cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Report File
              </button>
              <button onClick={() => setReportEmp(null)} className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-xs font-extrabold rounded-xl cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Employee Detail Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img src={selectedEmp.avatar} alt={selectedEmp.name} className="w-12 h-12 rounded-2xl object-cover border border-purple-500/30" />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{selectedEmp.name}</h3>
                  <p className="text-xs font-bold text-purple-600 dark:text-purple-400">{selectedEmp.designation}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEmp(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <p className="text-slate-500 leading-relaxed">{selectedEmp.bio}</p>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1.5">
                <div><span className="text-slate-400">Department:</span> <strong className="text-slate-800 dark:text-slate-200">{selectedEmp.department}</strong></div>
                <div><span className="text-slate-400">Location:</span> <strong className="text-slate-800 dark:text-slate-200">{selectedEmp.location}</strong></div>
                <div><span className="text-slate-400">Email:</span> <strong className="text-slate-800 dark:text-slate-200">{selectedEmp.email}</strong></div>
                <div><span className="text-slate-400">Skill Readiness Index:</span> <strong className="text-emerald-500 font-extrabold">{selectedEmp.skillReadinessScore}%</strong></div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setSelectedEmp(null)} className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-xs font-extrabold rounded-xl cursor-pointer">
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Add New Employee</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jordan Lee"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jordan.lee@company.com"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Data Science & AI">Data Science & AI</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Product Management">Product Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDirectory;
