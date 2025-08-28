
import { db, jobs } from '../db/index.js';
import { like } from 'drizzle-orm';

export async function getJobsFromDB(params) {
  let query = db.select().from(jobs);
  if (params.search) {
    query = query.where(like(jobs.title, `%${params.search}%`));
  }
  return await query;
}