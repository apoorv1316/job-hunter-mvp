
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