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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Input
        placeholder="Company"
        value={company}
        onChange={(e) => onCompanyChange(e.target.value)}
        className="text-sm py-2.5 rounded-lg border-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
      />

      <Input
        placeholder="Location"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        className="text-sm py-2.5 rounded-lg border-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
      />

      <select
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white"
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
      >
        <option value="createdAt">Newest First</option>
        <option value="company">Company A-Z</option>
        <option value="title">Job Title A-Z</option>
      </select>

      <select
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white"
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
      >
        <option value={10}>10 jobs</option>
        <option value={20}>20 jobs</option>
        <option value={50}>50 jobs</option>
      </select>
    </div>
  );
}