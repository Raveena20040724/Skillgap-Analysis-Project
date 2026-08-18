const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-6 relative">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-600 to-teal-400"></div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
      </div>
      {subtitle && (
        <p className="text-sm text-slate-600 dark:text-slate-300 pl-4.5 font-medium">{subtitle}</p>
      )}
    </div>
  );
};

export default PageHeader;