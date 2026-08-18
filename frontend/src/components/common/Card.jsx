const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-none dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-md shadow-slate-200/50 dark:shadow-slate-950/50 transition-all duration-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card;