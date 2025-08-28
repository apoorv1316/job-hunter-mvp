export default function JobStats({ currentPage, limit, totalJobs, loading = false }) {
  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-40 animate-pulse mt-1 sm:mt-0"></div>
      </div>
    );
  }

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalJobs);
  
  return (
    <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50 px-4 py-3">
      <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        Job Results
      </h2>
      <p className="text-sm text-gray-600 font-medium">
        {totalJobs > 0 
          ? `${startItem}-${endItem} of ${totalJobs} jobs`
          : 'No jobs found'
        }
      </p>
    </div>
  );
}