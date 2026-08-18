import { useState } from 'react';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit2, 
  CheckCircle2, 
  XCircle,
  BarChart3,
  Trash2
} from 'lucide-react';
import Button from '../../components/common/Button';

const INITIAL_DEPARTMENTS = [
  { id: 1, name: 'Engineering', code: 'ENG', employeeCount: 145, readinessScore: 88, lead: 'Marcus Vance', targetScore: 90 },
  { id: 2, name: 'Product', code: 'PRD', employeeCount: 62, readinessScore: 84, lead: 'Sarah Jenkins', targetScore: 85 },
  { id: 3, name: 'Design', code: 'DSG', employeeCount: 40, readinessScore: 78, lead: 'Alex Morgan', targetScore: 82 },
  { id: 4, name: 'DevOps', code: 'OPS', employeeCount: 35, readinessScore: 92, lead: 'David Chen', targetScore: 90 },
  { id: 5, name: 'Data Science', code: 'DAT', employeeCount: 60, readinessScore: 81, lead: 'Priya Sharma', targetScore: 85 },
];

const DepartmentsManagement = () => {
  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('custom_departments_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('custom_departments_list', JSON.stringify(INITIAL_DEPARTMENTS));
    return INITIAL_DEPARTMENTS;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', code: '', lead: '', targetScore: '' });
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (!newDept.name || !newDept.code) return;
    const item = {
      id: Date.now(),
      name: newDept.name,
      code: newDept.code.toUpperCase(),
      lead: newDept.lead || 'Department Lead',
      targetScore: Number(newDept.targetScore) || 85,
      employeeCount: 0,
      readinessScore: 75
    };
    const updated = [...departments, item];
    setDepartments(updated);
    localStorage.setItem('custom_departments_list', JSON.stringify(updated));
    setNewDept({ name: '', code: '', lead: '', targetScore: '' });
    setIsAddModalOpen(false);
    showToast(`Department "${item.name}" added successfully.`);
  };

  const handleDeleteDepartment = (id, name) => {
    const updated = departments.filter((d) => d.id !== id);
    setDepartments(updated);
    localStorage.setItem('custom_departments_list', JSON.stringify(updated));
    showToast(`Department "${name}" removed successfully.`);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400 stroke-[2.2]" />
            Department Taxonomies & Benchmarks ({departments.length})
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Configure organizational departments, target skill readiness benchmarks, and team leads.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 shadow-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="p-6 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-5 transition-all duration-200 hover:shadow-2xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 rounded-full text-[10px] font-black uppercase">
                  {dept.code}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-extrabold text-emerald-500">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{dept.readinessScore}% Score</span>
                  </div>

                  <button
                    onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete Department"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {dept.name}
                </h2>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  Department Lead: <strong className="text-slate-700 dark:text-slate-200">{dept.lead}</strong>
                </p>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Employees</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">{dept.employeeCount} Members</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Benchmark</span>
                  <span className="text-sm font-black text-indigo-500">{dept.targetScore}% Goal</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex justify-between text-[11px] font-extrabold text-slate-400">
                <span>Readiness Progress</span>
                <span className="text-purple-600 dark:text-purple-400">{dept.readinessScore}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${dept.readinessScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Add New Department
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDepartment} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile Engineering"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Dept Code</label>
                  <input
                    type="text"
                    required
                    placeholder="MBL"
                    value={newDept.code}
                    onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Target Score (%)</label>
                  <input
                    type="number"
                    max={100}
                    min={1}
                    placeholder="e.g. 90"
                    value={newDept.targetScore}
                    onChange={(e) => {
                      const val = e.target.value.replace(/^0+(?=\d)/, '');
                      setNewDept({ ...newDept, targetScore: val });
                    }}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">Department Lead</label>
                <input
                  type="text"
                  placeholder="e.g. David Chen"
                  value={newDept.lead}
                  onChange={(e) => setNewDept({ ...newDept, lead: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Save Department
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsManagement;
