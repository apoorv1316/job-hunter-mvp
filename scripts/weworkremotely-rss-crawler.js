import { parseString } from 'xml2js';
import { db } from '../lib/db/index.js';
import { jobs } from '../lib/db/schema.js';
import { detectJobCategory } from '../lib/utils/jobCategories.js';

async function crawlWeWorkRemotelyRSS() {
  const rssUrl = 'https://weworkremotely.com/remote-jobs.rss';
  
  try {
    const response = await fetch(rssUrl);
    const xmlData = await response.text();
    
    const jobsData = await parseRSSXML(xmlData);
    
    if (jobsData.length > 0) {
      await saveJobsToDatabase(jobsData);
    }
    
  } catch (error) {
    throw error;
  }
}

function parseRSSXML(xmlData) {
  return new Promise((resolve, reject) => {
    parseString(xmlData, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      
      const items = result.rss?.channel?.[0]?.item || [];
      const jobs = items.map(item => {
        const title = item.title?.[0] || '';
        const description = item.description?.[0] || '';
        const link = item.link?.[0] || '';
        
        const colonIndex = title.indexOf(':');
        let jobTitle, company;
        
        if (colonIndex > 0) {
          company = title.substring(0, colonIndex).trim();
          jobTitle = title.substring(colonIndex + 1).trim();
        } else {
          const atIndex = title.lastIndexOf(' at ');
          jobTitle = atIndex > 0 ? title.substring(0, atIndex) : title;
          company = atIndex > 0 ? title.substring(atIndex + 4) : 'not specified';
        }
        
        const cleanDescription = description
          .replace(/<[^>]*>/g, ' ')           
          .replace(/&[^;]+;/g, ' ')
          .replace(/\s+/g, ' ')               
          .trim();
        
        let location = 'remote';
        let salary = 'not specified';
        
        const headquartersMatch = cleanDescription.match(/headquarters:\s*([^.\n]+?)(?:\s+(?:url:|position:|at\s+\w+|we\s+are|join\s+|the\s+|this\s+|about\s+|looking\s+))/i);
        if (headquartersMatch) {
          let hq = headquartersMatch[1].trim();
          
          hq = hq.replace(/\s+(url|position|at\s+\w+|we\s+are|join|the|this|about|looking).*$/i, '');
          hq = hq.replace(/\s*,?\s*$/, '');
          
          if (hq && hq !== 'remote' && hq.length < 50) {
            const parts = hq.split(',').map(p => p.trim());
            const lastPart = parts[parts.length - 1];
            
            if (lastPart && lastPart.length > 1) {
              location = `remote - ${lastPart}`;
            }
          }
        }
        
        const salaryPatterns = [
          /\$\d{1,3}(?:,\d{3})*(?:\s*-\s*\$\d{1,3}(?:,\d{3})*)?(?:\s*(?:per\s+year|annually|\/year|yr))/i,
          /\$\d{1,3}(?:,\d{3})*(?:\s*-\s*\$\d{1,3}(?:,\d{3})*)?k?(?:\s*(?:per\s+year|annually|\/year))/i
        ];
        
        for (const pattern of salaryPatterns) {
          const match = cleanDescription.match(pattern);
          if (match) {
            salary = match[0].toLowerCase();
            break;
          }
        }
        const detectedCategory = detectJobCategory(jobTitle);
        
        return {
          title: jobTitle.toLowerCase().trim(),
          company: company.toLowerCase().trim(),
          location: location.toLowerCase().trim(),
          salary: salary.toLowerCase().trim(),
          category: detectedCategory,
          description: cleanDescription.toLowerCase().substring(0, 500),
          externalUrl: link
        };
      }).filter(job => job.title.length > 3 && job.company !== 'not specified');
      
      resolve(jobs);
    });
  });
}

async function saveJobsToDatabase(jobsArray) {
  for (const job of jobsArray) {
    await db.insert(jobs).values(job);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  crawlWeWorkRemotelyRSS()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { crawlWeWorkRemotelyRSS };