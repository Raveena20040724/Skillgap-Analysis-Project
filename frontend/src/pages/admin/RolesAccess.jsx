import { useState } from 'react';
import {
  ShieldCheck,
  Key,
  Lock,
  Check,
  X,
  Users,
  Plus,
  ChevronRight,
  Info,
  Sliders,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react';
import Button from '../../components/common/Button';

const INITIAL_ROLES = [
  {
    id: 'admin',
    name: 'System Admin',
    badge: 'SUPER ADMIN',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    usersCount: 3,
    coverage: 100,
    description: 'Full root access to telemetry engines, RBAC policies, database backups, and AI API keys.'
  },
  {
    id: 'hr',
    name: 'HR Manager',
    badge: 'WORKFORCE HR',
    color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30',
    usersCount: 6,
    coverage: 72,
    description: 'Access to department skill gap analytics, employee directories, and assessment benchmarks.'
  },
  {
    id: 'employee',
    name: 'Employee',
    badge: 'TALENT MEMBER',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    usersCount: 333,
    coverage: 28,
    description: 'Personal skill gap telemetry, course recommendations, learning roadmaps, and resume parsing.'
  }
];

const INITIAL_PERMISSIONS = [
  { id: 1, scope: 'View Personal Skill Gap Telemetry', admin: true, hr: true, employee: true },
  { id: 2, scope: 'Submit Skill Assessments & Quizzes', admin: true, hr: true, employee: true },
  { id: 3, scope: 'View Department Readiness Analytics', admin: true, hr: true, employee: false },
  { id: 4, scope: 'Export Team Skill Reports (CSV/PDF)', admin: true, hr: true, employee: false },
  { id: 5, scope: 'Manage User Accounts & Suspend Users', admin: true, hr: false, employee: false },
  { id: 6, scope: 'Configure AI Inference Model & API Keys', admin: true, hr: false, employee: false },
  { id: 7, scope: 'Execute System Backups & Maintenance', admin: true, hr: false, employee: false },
];

const RolesAccess = () => {
  const [roles, setRoles] = useState(() => {
    try {
      const saved = localStorage.getItem('custom_roles_list');
      return saved ? JSON.parse(saved) : INITIAL_ROLES;
    } catch {
      return INITIAL_ROLES;
    }
  });

  const [permissions, setPermissions] = useState(() => {
    try {
      const saved = localStorage.getItem('custom_permissions_matrix');
      return saved ? JSON.parse(saved) : INITIAL_PERMISSIONS;
    } catch {
      return INITIAL_PERMISSIONS;
    }
  });

  const [selectedRole, setSelectedRole] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', badge: 'CUSTOM ROLE', description: '' });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleTogglePermission = (permId, roleKey) => {
    const updatedPermissions = permissions.map((p) => {
      if (p.id === permId) {
        const nextState = !p[roleKey];
        showToast(`Permission "${p.scope}" ${nextState ? 'GRANTED to' : 'REVOKED from'} ${roleKey.toUpperCase()}`);
        return { ...p, [roleKey]: nextState };
      }
      return p;
    });

    setPermissions(updatedPermissions);
    localStorage.setItem('custom_permissions_matrix', JSON.stringify(updatedPermissions));

    // Recalculate coverage for the role
    const totalScopes = updatedPermissions.length;
    const grantedScopes = updatedPermissions.filter(p => !!p[roleKey]).length;
    const newCoverage = totalScopes > 0 ? Math.round((grantedScopes / totalScopes) * 100) : 0;

    const updatedRoles = roles.map(r => {
      if (r.id === roleKey) {
        return { ...r, coverage: newCoverage };
      }
      return r;
    });
    setRoles(updatedRoles);
    localStorage.setItem('custom_roles_list', JSON.stringify(updatedRoles));
  };

  const handleCreateRoleSubmit = (e) => {
    e.preventDefault();
    if (!newRole.name) return;

    const roleId = `role_${Date.now()}`;
    const created = {
      id: roleId,
      name: newRole.name,
      badge: (newRole.badge || 'CUSTOM ROLE').toUpperCase(),
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      usersCount: 0,
      coverage: 43,
      description: newRole.description || 'Custom organization role with tailored permission scopes.'
    };

    const updatedRoles = [...roles, created];
    setRoles(updatedRoles);
    localStorage.setItem('custom_roles_list', JSON.stringify(updatedRoles));

    // Initialize default permissions for new custom role (e.g. basic permissions enabled)
    const updatedPermissions = permissions.map((p, idx) => ({
      ...p,
      [roleId]: idx < 3 // first 3 permissions enabled by default
    }));
    setPermissions(updatedPermissions);
    localStorage.setItem('custom_permissions_matrix', JSON.stringify(updatedPermissions));

    setNewRole({ name: '', badge: 'CUSTOM ROLE', description: '' });
    setIsCreateRoleOpen(false);
    showToast(`Custom role "${created.name}" successfully created with active RBAC matrix!`);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-teal-400 stroke-[2.2]" />
            Roles & Access Control (RBAC)
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Define permissions, API scope access, and administrative privileges across organization roles.
          </p>
        </div>

        <button
          onClick={() => setIsCreateRoleOpen(true)}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Role</span>
        </button>
      </div>

      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 shadow-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Summary Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Active Roles</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{roles.length} Roles</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Key className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Permission Scopes</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{permissions.length} Scopes</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Assigned Users</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">342 Members</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Security Status</p>
            <p className="text-2xl font-black text-emerald-500 mt-0.5">100% Compliant</p>
          </div>
        </div>
      </div>

      {/* Role Definition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="p-6 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${role.color}`}>
                  {role.badge}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {role.usersCount} Users
                </span>
              </div>

              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {role.name}
              </h2>

              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {role.description}
              </p>

              {/* Progress Coverage Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-extrabold text-slate-400">
                  <span>Privilege Coverage</span>
                  <span className="text-blue-600 dark:text-teal-400">{role.coverage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${role.coverage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedRole(role)}
                className="text-xs font-extrabold text-blue-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Configure Permissions</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Scope Matrix */}
      <div className="p-6 md:p-8 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-500" />
              Interactive System Permissions Matrix
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Click any icon directly in the grid to grant or revoke permission scopes in real-time
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="p-4 pl-4 min-w-[240px]">Permission Scope</th>
                {roles.map((r) => (
                  <th key={r.id} className="p-4 text-center min-w-[120px]">
                    <div className="font-bold">{r.name}</div>
                    <span className="text-[9px] font-mono text-slate-400 lowercase">({r.badge})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {permissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 pl-4 font-bold text-slate-900 dark:text-white">
                    {perm.scope}
                  </td>
                  {roles.map((r) => {
                    const isGranted = !!perm[r.id];
                    return (
                      <td key={r.id} className="p-4 text-center">
                        <button
                          onClick={() => handleTogglePermission(perm.id, r.id)}
                          className="cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                          title={`Toggle ${perm.scope} for ${r.name}`}
                        >
                          {isGranted ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <X className="w-4 h-4 stroke-[3]" />
                            </span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Editor Modal */}
      {selectedRole && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${selectedRole.color}`}>
                  {selectedRole.badge}
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                  Configure {selectedRole.name} Privileges
                </h3>
              </div>
              <button onClick={() => setSelectedRole(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <p className="text-slate-500 leading-relaxed">{selectedRole.description}</p>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                <h4 className="font-extrabold uppercase text-slate-400 tracking-wider text-[11px]">Enabled Scopes</h4>
                {permissions.map((p) => {
                  const key = selectedRole.id;
                  const isEnabled = !!p[key];
                  return (
                    <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between gap-3">
                      <span className="text-slate-800 dark:text-slate-200">{p.scope}</span>
                      <button
                        type="button"
                        onClick={() => handleTogglePermission(p.id, key)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase cursor-pointer transition-colors ${
                          isEnabled
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                        }`}
                      >
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="primary" onClick={() => setSelectedRole(null)} className="bg-blue-600 hover:bg-blue-700">
                Done Configuring
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Role Modal */}
      {isCreateRoleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Create Custom System Role
              </h3>
              <button onClick={() => setIsCreateRoleOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Talent Auditor"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">Badge Label</label>
                <input
                  type="text"
                  placeholder="e.g. AUDITOR"
                  value={newRole.badge}
                  onChange={(e) => setNewRole({ ...newRole, badge: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">Role Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the privileges and scope assigned to this custom role..."
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Save Custom Role
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesAccess;
