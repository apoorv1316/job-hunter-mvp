import Header from '../components/layout/Header';
import JobsPageClient from '../components/pages/JobsPageClient';
import { getAllJobsFromDB } from '@/lib/services/jobService';

export const revalidate = 3600;

export default async function Home() {
  const jobs = await getAllJobsFromDB();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <JobsPageClient initialJobs={jobs} />
    </div>
  );
}