import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Trash2, 
  AlertCircle, 
  Info, 
  Mail, 
  X, 
  Sparkles 
} from 'lucide-react';

let toastTimeoutId = null;

export const showGlobalToast = (message, type = 'success', duration = 4000) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('app-toast', {
        detail: { message, type, duration, id: Date.now() }
      })
    );
  }
};

const ToastContainer = () => {
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const handleToast = (e) => {
      const { message, type = 'success', duration = 4000 } = e.detail;
      setToast({ message, type, duration, id: Date.now() });
      setProgress(100);

      if (toastTimeoutId) clearTimeout(toastTimeoutId);

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remainingPct = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remainingPct);
        if (remainingPct <= 0) clearInterval(interval);
      }, 50);

      toastTimeoutId = setTimeout(() => {
        setToast(null);
        clearInterval(interval);
      }, duration);
    };

    window.addEventListener('app-toast', handleToast);
    return () => {
      window.removeEventListener('app-toast', handleToast);
      if (toastTimeoutId) clearTimeout(toastTimeoutId);
    };
  }, []);

  if (!toast) return null;

  const isDelete = toast.type === 'delete' || toast.type === 'danger';
  const isWarning = toast.type === 'warning';
  const isInfo = toast.type === 'info' || toast.type === 'email';
  const isSuccess = !isDelete && !isWarning && !isInfo;

  return (
    <div className="fixed top-6 right-6 z-[999999] max-w-md w-[calc(100vw-3rem)] animate-slide-in-down pointer-events-auto">
      <div 
        className={`relative overflow-hidden rounded-2xl p-4 shadow-2xl backdrop-blur-xl border transition-all duration-300 ${
          isDelete 
            ? 'bg-slate-900/95 dark:bg-slate-950/95 border-rose-500/50 text-white shadow-rose-950/40' 
            : isWarning
            ? 'bg-slate-900/95 dark:bg-slate-950/95 border-amber-500/50 text-white shadow-amber-950/40'
            : isInfo
            ? 'bg-slate-900/95 dark:bg-slate-950/95 border-blue-500/50 text-white shadow-blue-950/40'
            : 'bg-slate-900/95 dark:bg-slate-950/95 border-emerald-500/50 text-white shadow-emerald-950/40'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div 
            className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
              isDelete 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                : isWarning
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : isInfo
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isDelete ? (
              <Trash2 className="w-5 h-5" />
            ) : isWarning ? (
              <AlertCircle className="w-5 h-5" />
            ) : isInfo ? (
              <Mail className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <p className={`text-[10px] font-black uppercase tracking-wider ${
              isDelete ? 'text-rose-400' : isWarning ? 'text-amber-400' : isInfo ? 'text-blue-400' : 'text-emerald-400'
            }`}>
              {isDelete ? 'Action Confirmed' : isWarning ? 'Notice' : isInfo ? 'Email & System Notice' : 'System Update Success'}
            </p>
            <p className="text-xs font-bold text-slate-100 mt-0.5 leading-snug">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => setToast(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div 
            className={`h-full transition-all duration-75 ${
              isDelete ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : isInfo ? 'bg-blue-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ToastContainer;
