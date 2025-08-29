
import { db, jobs } from '../db/index.js';
import { like, or, and, desc, asc } from 'drizzle-orm';

export async function getJobsFromDB(params) {
  let query = db.select().from(jobs);
  const conditions = [];
  
  if (params.search) {
    conditions.push(
      or(
        like(jobs.title, `%${params.search}%`),
        like(jobs.description, `%${params.search}%`),
        like(jobs.company, `%${params.search}%`)
      )
    );
  }
  
  if (params.company) {
    conditions.push(like(jobs.company, `%${params.company}%`));
  }
  
  if (params.location) {
    conditions.push(like(jobs.location, `%${params.location}%`));
  }
  
  if (params.country) {
    conditions.push(like(jobs.location, `%${params.country}%`));
  }
  
  if (params.category) {
    conditions.push(like(jobs.category, `%${params.category}%`));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  const sortField = jobs[params.sortBy] || jobs.createdAt;
  const sortDirection = params.sortOrder === 'asc' ? asc : desc;
  query = query.orderBy(sortDirection(sortField));
  
  const offset = (params.page - 1) * params.limit; 
  query = query.limit(params.limit).offset(offset);
  
  return await query;
}

export async function getAllJobsFromDB() {
  const query = db.select().from(jobs)
    .orderBy(desc(jobs.createdAt));
  
  return await query;
}

export async function getFilterOptionsFromDB() {
  const allJobs = await getAllJobsFromDB();
  
  const countries = new Set();
  const rejectedLocations = new Set();
  
  allJobs.forEach(job => {
    if (job.location && job.location.includes('remote - ')) {
      const locationPart = job.location.split('remote - ')[1];
      if (locationPart && locationPart.trim()) {
        const country = extractCountry(locationPart.trim());
        if (country) {
          countries.add(country);
        } else {
          rejectedLocations.add(locationPart.trim());
        }
      }
    }
  });
    const categories = new Set();
  allJobs.forEach(job => {
    if (job.category && job.category !== 'other') {
      categories.add(job.category);
    }
  });
  
  return {
    countries: Array.from(countries).sort(),
    categories: Array.from(categories).sort()
  };
}

function extractCountry(locationPart) {
  const locationLower = locationPart.toLowerCase();  
  if (locationLower === 'usa' || locationLower === 'united states' || locationLower === 'us') {
    return 'usa';
  }
  if (locationLower === 'uk' || locationLower === 'united kingdom') {
    return 'uk';
  }
  const validCountries = [
    'canada', 'australia', 'denmark', 'germany', 'belgium', 
    'sweden', 'netherlands', 'france', 'spain', 'italy', 
    'switzerland', 'norway', 'finland', 'brazil', 'mexico', 
    'argentina', 'estonia', 'portugal',
  ];
  
  if (validCountries.includes(locationLower)) {
    return locationLower;
  }
  
  return null;
}