import { NextResponse } from 'next/server';
import { getFilterOptionsFromDB } from '@/lib/services/jobService.js';

export async function GET() {
  try {
    const filterOptions = await getFilterOptionsFromDB();
    
    return NextResponse.json({
      success: true,
      data: filterOptions
    });
    
  } catch (error) {
    console.error('Filters API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' }, 
      { status: 500 }
    );
  }
}