export function validateJobsParams(searchParams) {
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
  
  return {
    search,
    company,
    location,
    page,
    limit
  };
}