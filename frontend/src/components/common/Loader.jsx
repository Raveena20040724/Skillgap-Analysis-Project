const Loader = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-12 h-12 rounded-full border-2 border-indigo-500/20 animate-ping"></div>
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-indigo-600 border-t-transparent dark:border-indigo-400 dark:border-t-transparent shadow-lg shadow-indigo-500/20"></div>
      </div>
    </div>
  );
};

export default Loader;