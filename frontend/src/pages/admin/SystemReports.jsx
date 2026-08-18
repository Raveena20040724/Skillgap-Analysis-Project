import { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  PieChart, 
  BarChart, 
  ShieldAlert, 
  Database,
  FileSpreadsheet
} from 'lucide-react';
import Button from '../../components/common/Button';

const REPORTS = [
  {
    id: 1,
    title: 'Organization Skill Readiness Audit Report',
    type: 'CSV Data Export',
    format: 'CSV / Excel',
    size: '1.4 MB',
    date: 'Updated Today',
    description: 'Comprehensive breakdown of skill readiness scores across all 342 employees and 5 departments.'
  },
  {
    id: 2,
    title: 'Security & Access Control Telemetry Audit',
    type: 'Security Log',
    format: 'JSON / Log',
    size: '4.8 MB',
    date: 'Updated 2h ago',
    description: 'Audit logs of user logins, role privilege modifications, and administrative API key rotations.'
  },
  {
    id: 3,
    title: 'AI Model Inference Token Telemetry',
    type: 'AI Usage Report',
    format: 'PDF Report',
    size: '2.1 MB',
    date: 'Updated Yesterday',
    description: 'Detailed metrics of Google Gemini 3.5 Flash API calls, latency telemetry, and token usage counts.'
  },
  {
    id: 4,
    title: 'Department Skill Gap & Course Fulfillment Report',
    type: 'HR Analytics',
    format: 'PDF Report',
    size: '3.2 MB',
    date: 'Updated 3 days ago',
    description: 'Analysis of identified skill gaps and course completion rates by engineering and product teams.'
  }
];

const SystemReports = () => {
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadedMsg, setDownloadedMsg] = useState('');

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

  const handleDownload = (report) => {
    setDownloadingId(report.id);
    setTimeout(() => {
      setDownloadingId(null);

      if (report.id === 1) {
        // CSV Skill Readiness Report
        const csvRows = [
          'Employee ID,Full Name,Email,Department,Designation,Skill Score,Identified Gaps,Readiness Status',
          'EMP-101,Alex Morgan,alex.morgan@company.com,Engineering,Frontend Developer,88%,Kubernetes/GraphQL,Ready',
          'EMP-102,Marcus Vance,admin@company.com,Operations,System Administrator,96%,None,Certified',
          'EMP-103,Sarah Jenkins,sarah.jenkins@company.com,HR,People Lead,92%,BigQuery Analytics,Certified',
          'EMP-104,David Kim,david.kim@company.com,Engineering,Backend Engineer,74%,Microservices/Docker,In Training',
          'EMP-105,Elena Rostova,elena.rostova@company.com,Design,Product Designer,85%,Figma Design Systems,Ready'
        ].join('\n');
        triggerDownload('Organization_Skill_Readiness_Report.csv', csvRows, 'text/csv;charset=utf-8;');
      } else if (report.id === 2) {
        // JSON Security Telemetry Log
        const securityLogs = {
          auditVersion: '2.4.0',
          generatedAt: new Date().toISOString(),
          systemStatus: 'COMPLIANT_SECURE',
          activeRBACRoles: ['admin', 'hr', 'employee'],
          events: [
            { timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'admin@company.com', action: 'LOGIN_SUCCESS', ip: '192.168.1.45', mfa: 'PASSED' },
            { timestamp: new Date(Date.now() - 7200000).toISOString(), user: 'sarah.jenkins@company.com', action: 'ASSESSMENT_BENCHMARK_UPDATE', target: 'Engineering' },
            { timestamp: new Date(Date.now() - 10800000).toISOString(), user: 'alex.morgan@company.com', action: 'RESUME_PARSED', extractedSkills: 8 }
          ]
        };
        triggerDownload('Security_Access_Telemetry_Audit.json', JSON.stringify(securityLogs, null, 2), 'application/json;charset=utf-8;');
      } else if (report.id === 3) {
        // AI Model Token Telemetry
        const textReport = `=====================================================\nSKILLBRIDGE AI MODEL INFERENCE TOKEN TELEMETRY REPORT\n=====================================================\nGenerated: ${new Date().toLocaleString()}\nTarget Model: Google Gemini 3.5 Flash & Grok AI Engine\n\n1. TOTAL INFERENCE CALLS: 1,482 calls\n2. AVERAGE LATENCY: 240ms\n3. TOTAL PROMPT TOKENS: 412,890 tokens\n4. TOTAL COMPLETION TOKENS: 198,450 tokens\n5. ERROR RATE: 0.02% (Healthy REST Endpoints)\n\nSTATUS: Active & Operational\n=====================================================\n`;
        triggerDownload('AI_Model_Token_Telemetry_Report.txt', textReport, 'text/plain;charset=utf-8;');
      } else {
        // HR Analytics
        const hrReport = `=====================================================\nDEPARTMENT SKILL GAP & COURSE FULFILLMENT REPORT\n=====================================================\nGenerated: ${new Date().toLocaleString()}\nTotal Assessed Employees: 342\nTotal Departments: 5\n\n1. Engineering: 82% Avg Readiness (Top Gap: Kubernetes)\n2. Product Management: 88% Avg Readiness (Top Gap: SQL Analytics)\n3. Human Resources: 94% Avg Readiness (Top Gap: None)\n4. Quality Assurance: 79% Avg Readiness (Top Gap: Cypress E2E)\n5. Design & UX: 90% Avg Readiness (Top Gap: Design Tokens)\n=====================================================\n`;
        triggerDownload('Department_Skill_Gap_Course_Fulfillment.txt', hrReport, 'text/plain;charset=utf-8;');
      }

      setDownloadedMsg(`✅ Successfully downloaded ${report.title} (${report.format})`);
      setTimeout(() => setDownloadedMsg(''), 4000);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600 dark:text-teal-400 stroke-[2.2]" />
          System Analytics & Telemetry Reports
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          Download system audit logs, AI telemetry reports, and organization skill gap analytics.
        </p>
      </div>

      {/* Download Success Banner */}
      {downloadedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{downloadedMsg}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REPORTS.map((report) => (
          <div
            key={report.id}
            className="p-6 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-black uppercase">
                  {report.type}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {report.size} • {report.date}
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                {report.title}
              </h2>

              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {report.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                Format: <strong className="text-slate-700 dark:text-slate-200">{report.format}</strong>
              </span>

              <button
                onClick={() => handleDownload(report)}
                disabled={downloadingId === report.id}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloadingId === report.id ? 'Generating...' : 'Download'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemReports;
