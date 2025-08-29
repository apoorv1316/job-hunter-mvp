export const JOB_CATEGORIES = {
  'engineering': ['engineer', 'developer', 'programmer', 'architect', 'backend', 'frontend', 'full-stack', 'mobile', 'software'],
  'data': ['data scientist', 'analyst', 'qa', 'seo', 'analytics'],
  'product': ['product manager', 'ux', 'ui', 'designer', 'design'],
  'sales': ['sales', 'account executive', 'crm', 'business development'],
  'marketing': ['marketing', 'content', 'social media', 'growth'],
  'operations': ['manager', 'coordinator', 'assistant', 'dispatcher', 'operations'],
  'creative': ['writer', 'graphic designer', 'content', 'creative']
};

export function detectJobCategory(title) {
  const titleLower = title.toLowerCase();
  
  for (const [category, keywords] of Object.entries(JOB_CATEGORIES)) {
    if (keywords.some(keyword => titleLower.includes(keyword.toLowerCase()))) {
      return category;
    }
  }
  
  return 'other';
}