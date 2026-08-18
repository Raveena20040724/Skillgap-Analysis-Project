import { Inbox } from 'react-bootstrap-icons';

const EmptyState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3 shadow-inner">
        <Inbox size={22} />
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium text-center">{message}</p>
    </div>
  );
};

export default EmptyState;