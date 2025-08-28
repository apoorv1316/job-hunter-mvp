import Input from '../ui/Input';

export default function FilterPanel({ 
  company, 
  onCompanyChange, 
  location, 
  onLocationChange,
  sortBy,
  onSortByChange,
  limit,
  onLimitChange
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Input
        label="Company"
        placeholder="e.g. Google"
        value={company}
        onChange={(e) => onCompanyChange(e.target.value)}
      />

      <Input
        label="Location"
        placeholder="e.g. Remote"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="createdAt">Newest First</option>
          <option value="company">Company A-Z</option>
          <option value="title">Job Title A-Z</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Per Page
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value={10}>10 jobs</option>
          <option value={20}>20 jobs</option>
          <option value={50}>50 jobs</option>
        </select>
      </div>
    </div>
  );
}