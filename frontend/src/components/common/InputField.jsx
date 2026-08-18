const InputField = ({ label, type = 'text', name, value, onChange, error, placeholder }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-400/30 focus:border-red-500'
            : 'border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-950 focus:ring-teal-500/30 focus:border-blue-600 dark:focus:border-teal-400'
        }`}
      />
      {error && <p className="text-red-600 dark:text-red-400 text-xs font-semibold mt-1.5 flex items-center gap-1">{error}</p>}
    </div>
  );
};

export default InputField;