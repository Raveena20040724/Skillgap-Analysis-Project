import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  FileText, 
  Eye, 
  Building2, 
  Briefcase, 
  Mail, 
  Award,
  Sparkles,
  Trash2
} from 'lucide-react';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { adminService } from '../../services/adminService';
import { showGlobalToast } from '../../components/common/ToastContainer';

const INITIAL_HRS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Senior HR & People Operations Lead',
    department: 'Engineering',
    company: 'TechCorp Systems',
    managedStaff: '145 Employees',
    companySize: '500+ Staff',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    email: 'sarah.jenkins@techcorp.com'
  },
  {
    id: 2,
    name: 'Sophia Patel',
    role: 'Head of AI & Data Talent Acquisition',
    department: 'Data Science & AI',
    company: 'InnoTech Global',
    managedStaff: '60 Employees',
    companySize: '250+ Staff',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    email: 'sophia.patel@innotech.com'
  },
  {
    id: 3,
    name: 'David Chen',
    role: 'DevOps & Infrastructure Talent Lead',
    department: 'Engineering',
    company: 'CloudScale Networks',
    managedStaff: '35 Employees',
    companySize: '150+ Staff',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    email: 'david.chen@cloudscale.io'
  },
  {
    id: 4,
    name: 'Emily Watson',
    role: 'Lead Product & Design HR Manager',
    department: 'UI/UX Design',
    company: 'CreativeStack Studios',
    managedStaff: '40 Employees',
    companySize: '300+ Staff',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    email: 'emily.watson@creativestack.com'
  }
];

const CATEGORIES = [
  'All', 
  'Engineering', 
  'Data Science & AI', 
  'UI/UX Design', 
  'Product Management'
];

const UserManagement = () => {
  const [hrs, setHrs] = useState(() => {
    try {
      const saved = localStorage.getItem('all_hr_users_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const legacy = localStorage.getItem('custom_hr_users');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...parsed, ...INITIAL_HRS];
          localStorage.setItem('all_hr_users_list', JSON.stringify(merged));
          return merged;
        }
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem('all_hr_users_list', JSON.stringify(INITIAL_HRS));
    return INITIAL_HRS;
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedHr, setSelectedHr] = useState(null);
  const [reportModalHr, setReportModalHr] = useState(null);
  const [hrToDelete, setHrToDelete] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getAllUsers();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const backendHrs = res.data.filter(u => u.role === 'hr');
        if (backendHrs.length > 0) {
          setHrs(prev => {
            const currentList = Array.isArray(prev) ? prev : INITIAL_HRS;
            const merged = [...currentList];
            backendHrs.forEach(bu => {
              const existingIdx = merged.findIndex(h => h.email?.toLowerCase() === bu.email?.toLowerCase());
              if (existingIdx >= 0) {
                merged[existingIdx] = { ...merged[existingIdx], status: bu.is_active ? 'Active' : 'Suspended' };
              } else {
                merged.push({
                  id: bu.id,
                  name: bu.username || bu.email,
                  role: 'HR Operations Manager',
                  department: bu.department || 'Engineering',
                  company: 'TechCorp Systems',
                  managedStaff: '50 Employees',
                  companySize: '200+ Staff',
                  status: bu.is_active ? 'Active' : 'Suspended',
                  avatar: bu.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
                  email: bu.email
                });
              }
            });
            localStorage.setItem('all_hr_users_list', JSON.stringify(merged));
            return merged;
          });
        }
      }
    } catch (err) {
      console.log('Using local persistent HR list.', err);
    }
  };

  const [newHr, setNewHr] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Senior People Operations Manager',
    company: 'TechCorp Enterprise',
    department: 'Engineering',
    managedStaff: '50 Employees',
    companySize: '200+ Staff'
  });

  const filteredHrs = hrs.filter((hr) => {
    const matchesCategory = selectedCategory === 'All' || hr.department === selectedCategory;
    const matchesSearch = 
      hr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hr.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hr.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hr.email && hr.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddHrSubmit = (e) => {
    e.preventDefault();
    if (!newHr.name || !newHr.email || !newHr.password) return;

    const created = {
      id: Date.now(),
      ...newHr,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80'
    };

    const updated = [created, ...hrs];
    setHrs(updated);

    // Save into localStorage so newly created HR is persistent and can log in at /hr/login!
    localStorage.setItem('all_hr_users_list', JSON.stringify(updated));

    const existingCustomHrs = JSON.parse(localStorage.getItem('custom_hr_users') || '[]');
    localStorage.setItem('custom_hr_users', JSON.stringify([created, ...existingCustomHrs]));

    setNewHr({
      name: '',
      email: '',
      password: '',
      role: 'Senior People Operations Manager',
      company: 'TechCorp Enterprise',
      department: 'Engineering',
      managedStaff: '50 Employees',
      companySize: '200+ Staff'
    });
    setIsAddModalOpen(false);
    showGlobalToast(`Successfully created account for ${created.name}`, 'success');
  };

  const handleUpdateCompanyDetails = async (e) => {
    e.preventDefault();
    if (!selectedHr) return;
    
    const updated = hrs.map((h) => h.id === selectedHr.id ? selectedHr : h);
    setHrs(updated);
    localStorage.setItem('all_hr_users_list', JSON.stringify(updated));
    
    // Also try updating on backend API if available
    try {
      if (typeof selectedHr.id === 'number' && selectedHr.id < 1000000000000) {
        await adminService.updateUserStatus(selectedHr.id, {
          is_active: selectedHr.status === 'Active',
          department: selectedHr.department
        });
      }
    } catch (err) {
      console.warn('Backend update note:', err);
    }
    
    showGlobalToast(`Profile for ${selectedHr.name} updated successfully.`, 'success');
    setSelectedHr(null);
  };

  const handleDeleteClick = (hr, e) => {
    if (e) e.stopPropagation();
    setHrToDelete(hr);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!hrToDelete) return;
    
    const updated = hrs.filter((h) => h.id !== hrToDelete.id);
    setHrs(updated);
    localStorage.setItem('all_hr_users_list', JSON.stringify(updated));
    
    try {
      if (typeof hrToDelete.id === 'number' && hrToDelete.id < 1000000000000) {
        await adminService.deleteUser(hrToDelete.id);
      }
    } catch (err) {
      console.warn('Backend delete note:', err);
    }
    
    showGlobalToast(`User account "${hrToDelete.name}" deleted.`, 'delete');
    setIsDeleteConfirmOpen(false);
    if (selectedHr?.id === hrToDelete.id) {
      setSelectedHr(null);
    }
    setHrToDelete(null);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner (Matching Photo) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600 dark:text-teal-400 stroke-[2.2]" />
            Workforce & HR Directory ({filteredHrs.length})
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Inspect individual HR leads, company details, assigned departments, and active management reports.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New HR</span>
        </button>
      </div>

      {/* Filter & Search Toolbar (Without Side Scrollbar) */}
      <div className="p-4 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Search Input Box */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search HR name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        {/* Category Pills Container (NO SCROLLBAR) */}
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
            <Filter className="w-4 h-4" />
          </div>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* HR Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHrs.map((hr) => (
          <div
            key={hr.id}
            className="bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl"
          >
            <div className="space-y-4">
              {/* HR Profile Header Row */}
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src={hr.avatar}
                    alt={hr.name}
                    className="w-14 h-14 rounded-2xl object-cover shadow-md border border-slate-200 dark:border-slate-700"
                  />
                  {/* Verified Check Badge Icon */}
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white dark:border-[#161f33]">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-base text-slate-900 dark:text-white truncate">
                      {hr.name}
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-blue-600 dark:text-teal-400 truncate">
                    {hr.role}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 truncate">
                    {hr.company} • {hr.department}
                  </p>
                </div>
              </div>

              {/* Metric Box (Matching Photo) */}
              <div className="p-4 bg-slate-50 dark:bg-[#0f1524] border border-slate-200/80 dark:border-[#2b3854] rounded-2xl grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Managed</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white mt-0.5 block">{hr.managedStaff}</span>
                </div>
                <div className="border-x border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Company</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white mt-0.5 block">{hr.companySize}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
                  <span className="text-xs font-black text-emerald-500 mt-0.5 block">{hr.status}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Footer (Matching Photo) */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedHr(hr)}
                className="flex-1 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>

              <button
                onClick={() => setReportModalHr(hr)}
                className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-600/30"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New HR Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Add New HR Manager & Company
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHrSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">HR Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={newHr.name}
                    onChange={(e) => setNewHr({ ...newHr, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@company.com"
                    value={newHr.email}
                    onChange={(e) => setNewHr({ ...newHr, email: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center justify-between">
                  <span>Initial Account Password</span>
                  <span className="text-[10px] text-blue-500 font-semibold">(Min 6 characters)</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Set initial login password for this HR account..."
                  value={newHr.password}
                  onChange={(e) => setNewHr({ ...newHr, password: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">HR Role / Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Head of Talent Acquisition"
                    value={newHr.role}
                    onChange={(e) => setNewHr({ ...newHr, role: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="TechCorp Systems"
                    value={newHr.company}
                    onChange={(e) => setNewHr({ ...newHr, company: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Department</label>
                  <select
                    value={newHr.department}
                    onChange={(e) => setNewHr({ ...newHr, department: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Data Science & AI">Data Science & AI</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Product Management">Product Management</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Managed Staff</label>
                  <input
                    type="text"
                    placeholder="100 Employees"
                    value={newHr.managedStaff}
                    onChange={(e) => setNewHr({ ...newHr, managedStaff: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Company Size</label>
                  <input
                    type="text"
                    placeholder="500+ Staff"
                    value={newHr.companySize}
                    onChange={(e) => setNewHr({ ...newHr, companySize: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Save HR Manager
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / View HR Company Details Modal */}
      {selectedHr && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                Update HR & Workforce Profile
              </h3>
              <button onClick={() => setSelectedHr(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCompanyDetails} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={selectedHr.name}
                    onChange={(e) => setSelectedHr({ ...selectedHr, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={selectedHr.email || ''}
                    onChange={(e) => setSelectedHr({ ...selectedHr, email: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">HR Role / Title</label>
                  <input
                    type="text"
                    required
                    value={selectedHr.role}
                    onChange={(e) => setSelectedHr({ ...selectedHr, role: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Company Name</label>
                  <input
                    type="text"
                    required
                    value={selectedHr.company}
                    onChange={(e) => setSelectedHr({ ...selectedHr, company: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Department</label>
                  <select
                    value={selectedHr.department || 'Engineering'}
                    onChange={(e) => setSelectedHr({ ...selectedHr, department: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Data Science & AI">Data Science & AI</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Managed Staff</label>
                  <input
                    type="text"
                    value={selectedHr.managedStaff}
                    onChange={(e) => setSelectedHr({ ...selectedHr, managedStaff: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">Status</label>
                  <select
                    value={selectedHr.status}
                    onChange={(e) => setSelectedHr({ ...selectedHr, status: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleDeleteClick(selectedHr)}
                  className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-rose-200 dark:border-rose-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete User</span>
                </button>

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setSelectedHr(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Update Profile
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View HR Management Audit Report Modal */}
      {reportModalHr && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                HR Telemetry & Audit Report
              </h3>
              <button onClick={() => setReportModalHr(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2">
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">{reportModalHr.name}</p>
                <p className="text-blue-600 dark:text-teal-400 font-bold">{reportModalHr.role} • {reportModalHr.company}</p>
                <p className="text-slate-400">{reportModalHr.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Assigned Dept</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{reportModalHr.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Managed Workforce</span>
                  <span className="font-extrabold text-emerald-500">{reportModalHr.managedStaff}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setReportModalHr(null)}>
                Close Report
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Delete User Account"
        message={`Are you sure you want to delete the account for "${hrToDelete?.name}" (${hrToDelete?.email})? This action cannot be undone.`}
        confirmText="Yes, Delete User"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setHrToDelete(null);
        }}
      />
    </div>
  );
};

export default UserManagement;
