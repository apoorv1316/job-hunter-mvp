
import { db, jobs } from '../db/index.js';
import { like, or, and } from 'drizzle-orm';

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
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  const offset = (params.page - 1) * params.limit; 
  query = query.limit(params.limit).offset(offset);
  
  return await query;
}