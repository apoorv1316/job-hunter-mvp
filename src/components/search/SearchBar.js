import Input from '../ui/Input';

export default function SearchBar({ value, onChange, placeholder = "Search jobs, companies, or keywords..." }) {
  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-base pl-12 py-3 rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm placeholder:text-gray-600"
      />
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}