
import { db, jobs } from '../db/index.js';
import { like, or, sql } from 'drizzle-orm';

export async function getJobsFromDB(params) {
  let query = db.select().from(jobs);
  
  if (params.search) {
    query = query.where(
      or(
        like(jobs.title, `%${params.search}%`),
        like(jobs.description, `%${params.search}%`),
        like(jobs.company, `%${params.search}%`)
      )
    );
  }
  
  return await query;
}