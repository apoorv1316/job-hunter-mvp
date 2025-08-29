'use client';

import { useState, useEffect, useMemo } from 'react';
import SearchBar from '../search/SearchBar';
import FilterPanel from '../search/FilterPanel';
import JobGrid from '../jobs/JobGrid';
import JobStats from '../jobs/JobStats';

export default function JobsPageClient({ initialJobs }) {
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredJobs = useMemo(() => {
    let filtered = [...initialJobs];
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }
    if (company.trim()) {
      const companyLower = company.toLowerCase();
      filtered = filtered.filter(job =>
        job.company.toLowerCase().includes(companyLower)
      );
    }
    if (location.trim()) {
      const locationLower = location.toLowerCase();
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationLower)
      );
    }
    if (country.trim()) {
      const countryLower = country.toLowerCase();
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(countryLower)
      );
    }
    if (category.trim()) {
      filtered = filtered.filter(job =>
        job.category === category
      );
    }
    filtered.sort((a, b) => {
      const field = sortBy || 'createdAt';
      const aVal = a[field] || '';
      const bVal = b[field] || '';
      
      if (field === 'createdAt') {
        return new Date(bVal) - new Date(aVal);
      }
      
      return aVal.localeCompare(bVal);
    });

    return filtered;
  }, [initialJobs, search, country, category, sortBy]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    return filteredJobs.slice(startIndex, startIndex + limit);
  }, [filteredJobs, currentPage, limit]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, country, category, sortBy, limit]);

  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / limit);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-lg text-gray-600">Discover opportunities that match your passion</p>
        </div>
        
        <div className="bg-white/90 rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-5">
              <SearchBar 
                value={search} 
                onChange={setSearch}
                placeholder="Search jobs, companies, or keywords..."
              />
            </div>
            <div className="lg:col-span-7">
              <FilterPanel
                company={company}
                onCompanyChange={setCompany}
                location={location}
                onLocationChange={setLocation}
                country={country}
                onCountryChange={setCountry}
                category={category}
                onCategoryChange={setCategory}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                limit={limit}
                onLimitChange={setLimit}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <JobStats 
          currentPage={currentPage}
          limit={limit}
          totalJobs={totalJobs}
        />
        
        <JobGrid jobs={paginatedJobs} />

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 py-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </main>
  );
}