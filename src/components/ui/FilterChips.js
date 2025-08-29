export default function FilterChips({ 
  countries = [], 
  categories = [], 
  onRemoveCountry, 
  onRemoveCategory, 
  onClearAll 
}) {
  const hasFilters = countries.length > 0 || categories.length > 0;

  if (!hasFilters) return null;

  const formatLabel = (value, type) => {
    if (type === 'country') {
      const labels = {
        'usa': 'United States',
        'united states': 'United States',
        'us': 'United States',
        'uk': 'United Kingdom',
        'united kingdom': 'United Kingdom',
        'remote': 'Remote Only'
      };
      return labels[value] || value.charAt(0).toUpperCase() + value.slice(1);
    }
    if (type === 'category') {
      const labels = {
        'engineering': 'Engineering',
        'data': 'Data & Analytics', 
        'product': 'Product & Design',
        'sales': 'Sales',
        'marketing': 'Marketing',
        'operations': 'Operations',
        'creative': 'Creative & Content'
      };
      return labels[value] || value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm font-medium text-gray-700">Active filters:</span>
      
      {countries.map(country => (
        <div
          key={`country-${country}`}
          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
        >
          <span>{formatLabel(country, 'country')}</span>
          <button
            onClick={() => onRemoveCountry(country)}
            className="ml-1 hover:text-blue-900 focus:outline-none"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
      
      {categories.map(category => (
        <div
          key={`category-${category}`}
          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
        >
          <span>{formatLabel(category, 'category')}</span>
          <button
            onClick={() => onRemoveCategory(category)}
            className="ml-1 hover:text-green-900 focus:outline-none"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
      
      <button
        onClick={onClearAll}
        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}