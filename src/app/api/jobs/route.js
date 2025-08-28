import { NextResponse } from 'next/server';
import { db, jobs } from '../../../../lib/db/index.js';
import { like } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawSearch = searchParams.get('search');     
    const rawCompany = searchParams.get('company');   
    const rawLocation = searchParams.get('location');
    const rawPage = searchParams.get('page');         
    const rawLimit = searchParams.get('limit');

    const search = rawSearch ? rawSearch.trim().slice(0, 100) : '';
    const company = rawCompany ? rawCompany.trim().slice(0, 100) : '';
    const location = rawLocation ? rawLocation.trim().slice(0, 100) : '';
    const page = rawPage ? parseInt(rawPage) : 1;         
    const limit = rawLimit ? parseInt(rawLimit) : 10;
    
    let query = db.select().from(jobs);
    
    if (search) {
      query = query.where(like(jobs.title, `%${search}%`));
    }
    
    const allJobs = await query;
    
    return NextResponse.json({
      success: true,
      data: allJobs,
      count: allJobs.length
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' }, 
      { status: 500 }
    );
  }
}