export function validateJobsParams(searchParams) {
  const rawSearch = searchParams.get('search');     
  const rawCompany = searchParams.get('company');   
  const rawLocation = searchParams.get('location');
  const rawCountry = searchParams.get('country');
  const rawCategory = searchParams.get('category');
  const rawPage = searchParams.get('page');         
  const rawLimit = searchParams.get('limit');
  const rawSortBy = searchParams.get('sortBy');
  const rawSortOrder = searchParams.get('sortOrder');
  
  const search = rawSearch ? rawSearch.trim().toLowerCase().slice(0, 100) : '';
  const company = rawCompany ? rawCompany.trim().slice(0, 100) : '';
  const location = rawLocation ? rawLocation.trim().slice(0, 100) : '';
  const country = rawCountry ? rawCountry.trim().toLowerCase().slice(0, 50) : '';
  const category = rawCategory ? rawCategory.trim().toLowerCase().slice(0, 50) : '';
  const page = rawPage ? parseInt(rawPage) : 1;
  const limit = rawLimit ? parseInt(rawLimit) : 10;
  const sortBy = rawSortBy || 'createdAt';
  const sortOrder = rawSortOrder === 'asc' ? 'asc' : 'desc';
  
  return {
    search,
    company,
    location,
    country,
    category,
    page,
    limit,
    sortBy,
    sortOrder
  };
}