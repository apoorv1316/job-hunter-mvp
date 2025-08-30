import { parseString } from 'xml2js';
import { db } from '../lib/db/index.js';
import { jobs } from '../lib/db/schema.js';
import { detectJobCategory } from '../lib/utils/jobCategories.js';

const CRAWLER_CONFIG = {
  maxRetries : 3,
  baseDelayMs: 1000, 
  requestTimeoutMs: 30000,
  politenessDelayMs: 2000,
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateBackoffDelay(attempt, baseDelay = CRAWLER_CONFIG.baseDelayMs) {
  return baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
}

function isTransientError(error) {
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
    return true;
  }
  if (error.status >= 500 && error.status < 600) {
    return true;
  }
  if (error.status === 429) {
    return true;
  }
  return false;
}

async function fetchWithRetry(url, options = {}) {
  let lastError;
  
  for (let attempt = 0; attempt < CRAWLER_CONFIG.maxRetries; attempt++) {
    try {      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CRAWLER_CONFIG.requestTimeoutMs);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'User-Agent': 'JobHunter-Bot/1.0 (Polite Crawler)',
          'Accept': 'application/rss+xml, application/xml, text/xml',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        throw error;
      }
            return response;
      
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${attempt + 1} failed:`, error.message);
      
      if (!isTransientError(error)) {
        console.log(` Non-transient error, not retrying`);
        break;
      }
      
      if (attempt < CRAWLER_CONFIG.maxRetries - 1) {
        const delay = calculateBackoffDelay(attempt);
        console.log(` Waiting ${Math.round(delay)}ms before retry...`);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}

async function crawlWeWorkRemotelyRSS() {
  const rssUrl = 'https://weworkremotely.com/remote-jobs.rss';
  
  try {    
    await sleep(CRAWLER_CONFIG.politenessDelayMs);  
    const response = await fetchWithRetry(rssUrl);
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