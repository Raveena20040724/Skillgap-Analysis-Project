import Button from './Button';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', variant = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant={variant} onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;