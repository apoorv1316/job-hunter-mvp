import { NextResponse } from 'next/server';
import { validateJobsParams } from '@/lib/validation/jobsApi.js';
import { getJobsFromDB } from '@/lib/services/jobService.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cleanParams = validateJobsParams(searchParams);
    
    const allJobs = await getJobsFromDB(cleanParams);
    
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