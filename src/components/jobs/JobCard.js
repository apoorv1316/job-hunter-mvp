import Button from '../ui/Button';

export default function JobCard({ job }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleApply = () => {
    window.open(job.externalUrl, '_blank');
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/60 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                <span className="font-medium text-blue-600">{job.company}</span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </span>
                {job.salary && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="font-medium text-green-600">{job.salary}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2 ml-4">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {formatDate(job.createdAt)}
              </span>
              <Button onClick={handleApply} variant="primary" size="sm" className="whitespace-nowrap">
                Apply Now
              </Button>
            </div>
          </div>
          
          {job.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {job.description.length > 120 
                ? `${job.description.substring(0, 120)}...` 
                : job.description}
            </p>
          )}
          
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {job.tags.slice(0, 5).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-100 font-medium"
                >
                  {tag}
                </span>
              ))}
              {job.tags.length > 5 && (
                <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-md border border-gray-200">
                  +{job.tags.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}