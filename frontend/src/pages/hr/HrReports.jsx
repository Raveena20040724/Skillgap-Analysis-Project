import { useState } from 'react';
import { PieChart as PieIcon, Download, FileText, CheckCircle2 } from 'lucide-react';
import { showGlobalToast } from '../../components/common/ToastContainer';

const INITIAL_REPORTS = [
  {
    id: 'rep_1',
    title: 'Organization Skill Readiness Audit Report',
    type: 'Workforce Audit',
    dateGenerated: 'Today',
    metricsSummary: 'Comprehensive assessment breakdown across verified directory personnel and monitored departments.'
  },
  {
    id: 'rep_2',
    title: 'Engineering & DevOps Gap Telemetry Index',
    type: 'Department Gap',
    dateGenerated: '2 days ago',
    metricsSummary: 'Analysis of Cloud, DevOps, and Fullstack architecture competencies.'
  },
  {
    id: 'rep_3',
    title: 'AI & Data Science Course Fulfillment Report',
    type: 'Learning Program',
    dateGenerated: '1 week ago',
    metricsSummary: 'Completion metrics for AI / ML, LLM Fine-Tuning, and Data analytics modules.'
  }
];

const HrReports = () => {
  const [reports] = useState(INITIAL_REPORTS);

  const getLiveEmployees = () => {
    try {
      const saved = localStorage.getItem('custom_employee_directory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'EMP-01', name: 'Alex Morgan', department: 'Engineering', designation: 'Senior Frontend Developer', skillReadinessScore: 84 },
      { id: 'EMP-02', name: 'Sophia Patel', department: 'Data Science & AI', designation: 'Senior ML Engineer', skillReadinessScore: 91 },
      { id: 'EMP-03', name: 'David Chen', department: 'Engineering', designation: 'Backend DevOps Engineer', skillReadinessScore: 78 },
      { id: 'EMP-04', name: 'Emily Watson', department: 'UI/UX Design', designation: 'Lead Product Designer', skillReadinessScore: 88 }
    ];
  };

  const triggerDownload = (filename, content, mimeType = 'text/plain;charset=utf-8;') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = (title) => {
    const employees = getLiveEmployees();
    const totalCount = employees.length;
    const avgScore = (employees.reduce((acc, curr) => acc + (Number(curr.skillReadinessScore) || 75), 0) / totalCount).toFixed(1);
    const depts = [...new Set(employees.map(e => e.department))];

    const reportText = `=====================================================\nHR WORKFORCE READINESS & GAP AUDIT REPORT\n=====================================================\nReport Title: ${title}\nGenerated Date: ${new Date().toLocaleString()}\nAuditor: Human Resources & People Operations\n\n1. EXECUTIVE SUMMARY:\nTotal active personnel in directory: ${totalCount} members across ${depts.length} departments.\nAverage overall competency index: ${avgScore}%.\nMonitored Departments: ${depts.join(', ')}.\n\n2. ACTIVE WORKFORCE BREAKDOWN:\n${employees.map(e => `- ${e.name} (${e.department}) - ${e.designation}: ${e.skillReadinessScore || 80}% Readiness`).join('\n')}\n\n3. RECOMMENDED ACTIONS:\nContinuous monitoring and targeted upskilling pathways active.\n=====================================================\n`;
    triggerDownload(`${title.replace(/[^a-zA-Z0-9]/g, '_')}_Report.txt`, reportText, 'text/plain;charset=utf-8;');
    showGlobalToast(`Downloaded "${title}" audit report file!`, 'success');
  };

  const handleExportExcel = (title) => {
    const employees = getLiveEmployees();
    const csvRows = [
      'Employee ID,Name,Department,Designation,Skill Readiness Score,Status',
      ...employees.map(e => `${e.id || 'EMP'},"${e.name}","${e.department}","${e.designation || 'Specialist'}",${e.skillReadinessScore || 80}%,${(e.skillReadinessScore || 80) >= 80 ? 'Compliant' : 'Upskilling Recommended'}`)
    ];
    triggerDownload(`${title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`, csvRows.join('\n'), 'text/csv;charset=utf-8;');
    showGlobalToast(`Exported "${title}" CSV spreadsheet!`, 'success');
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <PieIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 stroke-[2.2]" />
          HR Analytics & Skill Readiness Reports
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          Generate executive telemetry files and CSV spreadsheets for department skill audits.
        </p>
      </div>

      {/* Reports List Cards */}
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-6 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-2xl"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 uppercase">
                  {report.type}
                </span>
                <span className="text-xs font-bold text-slate-400">Generated: {report.dateGenerated}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{report.title}</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-2xl">{report.metricsSummary}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleExportPDF(report.title)}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" /> Download Report
              </button>
              <button
                onClick={() => handleExportExcel(report.title)}
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-md shadow-violet-600/30 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HrReports;
