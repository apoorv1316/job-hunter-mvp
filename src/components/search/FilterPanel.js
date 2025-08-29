import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import SearchableDropdown from '../ui/SearchableDropdown';

export default function FilterPanel({ 
  country,
  onCountryChange,
  category,
  onCategoryChange,
  sortBy,
  onSortByChange,
  limit,
  onLimitChange
}) {
  const [countryOptions, setCountryOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const response = await fetch('/api/filters');
        const data = await response.json();
        
        if (data.success) {
          const formattedCountries = data.data.countries.map(country => ({
            value: country,
            label: formatCountryLabel(country)
          }));
          
          const formattedCategories = data.data.categories.map(category => ({
            value: category,
            label: formatCategoryLabel(category)
          }));
          
          setCountryOptions(formattedCountries);
          setCategoryOptions(formattedCategories);
        }
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFilterOptions();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <SearchableDropdown
        placeholder={loading ? "Loading..." : "Country"}
        value={country}
        onChange={onCountryChange}
        options={countryOptions}
      />
      <SearchableDropdown
        placeholder={loading ? "Loading..." : "Category"}
        value={category}
        onChange={onCategoryChange}
        options={categoryOptions}
      />

      <select
        className="w-full px-3 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white"
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
      >
        <option value="createdAt">Newest First</option>
        <option value="company">Company A-Z</option>
        <option value="title">Job Title A-Z</option>
      </select>

      <select
        className="w-full px-3 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white"
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

function formatCountryLabel(country) {
  const labels = {
    'usa': 'United States',
    'united states': 'United States',
    'us': 'United States',
    'uk': 'United Kingdom',
    'united kingdom': 'United Kingdom',
    'remote': 'Remote Only'
  };
  return labels[country] || country.charAt(0).toUpperCase() + country.slice(1);
}

function formatCategoryLabel(category) {
  const labels = {
    'engineering': 'Engineering',
    'data': 'Data & Analytics', 
    'product': 'Product & Design',
    'sales': 'Sales',
    'marketing': 'Marketing',
    'operations': 'Operations',
    'creative': 'Creative & Content'
  };
  return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
}