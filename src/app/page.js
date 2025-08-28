'use client';

import { useState } from 'react';
import Header from '../components/layout/Header';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import JobGrid from '../components/jobs/JobGrid';
import JobStats from '../components/jobs/JobStats';

export default function Home() {
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const jobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Google',
      location: 'San Francisco, CA',
      salary: '$150,000 - $200,000',
      description: 'Build scalable React applications for millions of users worldwide. Work with cutting-edge technology and a talented team.',
      tags: ['React', 'JavaScript', 'TypeScript', 'GraphQL'],
      createdAt: '2024-08-28T18:40:47.000Z',
      externalUrl: 'https://careers.google.com/job/react-dev-123'
    },
    {
      id: 2,
      title: 'Backend Python Engineer',
      company: 'Netflix',
      location: 'Remote',
      salary: '$120,000 - $160,000',
      description: 'Design and implement microservices using Python and Django. Scale systems for millions of concurrent users.',
      tags: ['Python', 'Django', 'AWS', 'Microservices'],
      createdAt: '2024-08-27T18:40:47.000Z',
      externalUrl: 'https://jobs.netflix.com/python-backend-456'
    },
    {
      id: 3,
      title: 'Full Stack JavaScript Developer',
      company: 'Spotify',
      location: 'New York, NY',
      salary: '$110,000 - $140,000',
      description: 'Work on music streaming features with Node.js and React. Create experiences used by millions of music lovers.',
      tags: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
      createdAt: '2024-08-26T18:40:47.000Z',
      externalUrl: 'https://spotifyjobs.com/fullstack-js-789'
    }
  ];

  const totalJobs = jobs.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Search Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
            <p className="text-lg text-gray-600">Discover opportunities that match your passion</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-5">
                <SearchBar 
                  value={search} 
                  onChange={setSearch}
                />
              </div>
              <div className="lg:col-span-7">
                <FilterPanel
                  company={company}
                  onCompanyChange={setCompany}
                  location={location}
                  onLocationChange={setLocation}
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
          
          <JobGrid jobs={jobs} />

          {/* TODO: Add Pagination component */}
        </div>
      </main>
    </div>
  );
}
