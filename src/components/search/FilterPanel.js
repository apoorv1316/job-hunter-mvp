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

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'company', label: 'Company A-Z' },
    { value: 'title', label: 'Job Title A-Z' }
  ];

  const limitOptions = [
    { value: '10', label: '10 jobs' },
    { value: '20', label: '20 jobs' },
    { value: '50', label: '50 jobs' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <SearchableDropdown
        placeholder={loading ? "Loading..." : "Country"}
        value={country}
        onChange={onCountryChange}
        options={countryOptions}
        multiSelect={true}
      />
      <SearchableDropdown
        placeholder={loading ? "Loading..." : "Category"}
        value={category}
        onChange={onCategoryChange}
        options={categoryOptions}
        multiSelect={true}
      />

      <SearchableDropdown
        placeholder="Sort by"
        value={sortBy}
        onChange={onSortByChange}
        options={sortOptions}
        searchable={false}
      />

      <SearchableDropdown
        placeholder="Jobs per page"
        value={limit.toString()}
        onChange={(value) => onLimitChange(Number(value))}
        options={limitOptions}
        searchable={false}
      />
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