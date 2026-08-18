import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { experienceService } from '../../services/experienceService';
import PageHeader from '../../components/common/PageHeader';

const DUMMY_EXPERIENCE = [
  {
    id: 1,
    companyName: 'ABC Tech Pvt Ltd',
    role: 'Junior Developer',
    startDate: '2023-06-01',
    endDate: '2024-05-01',
    description: 'Worked on frontend features using React.',
  },
];

const ExperienceManagement = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const response = await experienceService.getExperience();
      setExperiences(response.data);
    } catch (error) {
      console.error('Failed to fetch experience:', error);
      setExperiences(DUMMY_EXPERIENCE);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.role.trim()) {
      setMessage('Company name and role are required');
      return;
    }

    try {
      const response = await experienceService.addExperience(formData);
      setExperiences([...experiences, response.data]);
    } catch (error) {
      console.error('Failed to add experience (using fallback):', error);
      setExperiences([...experiences, { id: Date.now(), ...formData }]);
    }

    setFormData({ companyName: '', role: '', startDate: '', endDate: '', description: '' });
    setMessage('');
  };

  const handleDelete = async (id) => {
    try {
      await experienceService.deleteExperience(id);
    } catch (error) {
      console.error('Failed to delete on server (removing locally):', error);
    }
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader 
        title="Experience Management" 
        subtitle="Manage your past work history and technical project responsibilities."
      />

      {/* Add new experience form */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Work Experience</h2>
        {message && <p className="text-rose-600 dark:text-rose-400 text-xs font-semibold mb-3">{message}</p>}
        <form onSubmit={handleAdd} className="space-y-1">
          <InputField
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. ABC Tech Pvt Ltd"
          />
          <InputField
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. Software Developer"
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <InputField
                label="Start Date"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="End Date"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-medium"
              placeholder="Brief description of your role and responsibilities"
            />
          </div>
          <Button type="submit" variant="primary">Add Experience</Button>
        </form>
      </Card>

      {/* Experience list */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Your Experience</h2>
        {experiences.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No experience added yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="border border-slate-200 dark:border-slate-700/70 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{exp.role} @ {exp.companyName}</h3>
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </p>
                    {exp.description && (
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                  <Button variant="danger" onClick={() => handleDelete(exp.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExperienceManagement;