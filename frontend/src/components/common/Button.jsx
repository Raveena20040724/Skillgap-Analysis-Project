const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false }) => {
  const baseStyle = 'inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer select-none';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 via-teal-600 to-teal-500 hover:from-blue-500 hover:to-emerald-500 text-white shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 focus:ring-teal-400',
    secondary: 'bg-white/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/90 shadow-sm hover:shadow focus:ring-blue-400',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 focus:ring-rose-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${disabled ? 'opacity-50 cursor-not-allowed active:scale-100 shadow-none' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;