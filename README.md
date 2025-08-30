# Job Hunter MVP

A web application that crawls remote job listings and provides a searchable interface with advanced filtering capabilities.

## 📋 Features

### Crawler
- **RSS-based crawling** from WeWorkRemotely
- **Polite throttling** with 2-second delays between requests
- **Retry logic** with exponential backoff (3 attempts max)
- **Transient failure handling** (timeouts, 5xx errors, rate limits)
- **Duplicate job detection** and graceful handling

### Web Interface
- **Multi-select filters** for countries and job categories
- **Filter chips** showing active selections
- **Real-time search** across job titles, companies, and descriptions
- **Sorting** by date, company, or job title
- **Pagination** with configurable results per page
- **Responsive design** optimized for all devices

### Technical Stack
- **Frontend**: Next.js with React
- **Backend**: Next.js API routes
- **Database**: SQLite with Drizzle ORM
- **Crawler**: Node.js with polite crawling practices
- **Styling**: Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-hunter-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update the database path if needed:
   ```
   DATABASE_URL=./database.sqlite
   ```

4. **Initialize the database**
   ```bash
   npm run build
   ```

## 📊 Running the Crawler

### Basic Usage
```bash
# Run the crawler to fetch latest jobs
node scripts/weworkremotely-rss-crawler.js
```

### What the Crawler Does
- Fetches the RSS feed from WeWorkRemotely
- Parses job listings with title, company, location, salary, and description
- Categorizes jobs automatically (engineering, data, product, etc.)
- Saves jobs to SQLite database

## 🌐 Running the Web Application

### Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

## 📱 Using the Web Interface

### Search & Filtering
1. **Keyword Search**: Enter terms to search across job titles, companies, and descriptions
2. **Multi-Select Filters**:
   - **Countries**: Select multiple countries (United States, Canada, etc.)
   - **Categories**: Choose job categories (Engineering, Data & Analytics, etc.)
3. **Filter Chips**: View and remove active filters with one click
4. **Clear All**: Remove all filters at once

### Sorting & Pagination
- **Sort by**: Newest First, Company A-Z, or Job Title A-Z
- **Results per page**: 10, 20, or 50 jobs
- **Navigation**: Previous/Next pagination with page indicators

### Job Cards
- **Job details**: Title, company, location, salary (if available)
- **Posting date**: Relative time (e.g., "2 days ago")
- **Apply button**: Opens the original job posting in a new tab
- **Tags**: Relevant skills and technologies (if available)


### Database Schema
Jobs are stored with the following fields:
- `title`: Job title
- `company`: Company name  
- `location`: Job location
- `description`: Job description (truncated)
- `salary`: Salary information (if available)
- `category`: Auto-detected job category
- `externalUrl`: Link to original posting
- `createdAt`: Timestamp when job was crawled

## 📝 API Endpoints

### Get Jobs
```
GET /api/jobs?search=developer&country[]=usa&category[]=engineering&sortBy=createdAt&limit=10&page=1
```

**Query Parameters:**
- `search`: Keyword search (optional)
- `country[]`: Array of country filters (optional)
- `category[]`: Array of category filters (optional)
- `sortBy`: Sort field - `createdAt`, `company`, or `title` (default: `createdAt`)
- `limit`: Results per page (default: 10)
- `page`: Page number (default: 1)

### Get Filter Options
```
GET /api/filters
```
Returns available countries and categories for filtering.

## 🧪 Testing the Crawler

### Manual Testing
```bash
# Clear existing jobs and run fresh crawl
sqlite3 database.sqlite "DELETE FROM jobs;"
node scripts/weworkremotely-rss-crawler.js
```

## 🏗️ Architecture Decisions

### Why RSS Crawling?
- **Respectful**: RSS feeds are designed for automated consumption
- **Reliable**: Structured data format with consistent schema
- **Fast**: Single request gets all recent job listings
- **Compliant**: Follows site's intended data sharing mechanism

### Why SQLite?
- **Simplicity**: File-based database, no setup required
- **Performance**: Fast queries for small to medium datasets
- **Portability**: Database file can be easily backed up or moved

### Why Multi-Select Filters?
- **User Experience**: Users often want jobs from multiple countries/categories
- **Flexibility**: More powerful than single-selection dropdowns  
- **Visual Feedback**: Filter chips show current selections clearly

## 🚨 Limitations

- **Single Job Source**: Only crawls WeWorkRemotely RSS feed
- **RSS Limitations**: Only gets recent job postings (typically last 50-100)
- **No Real-time Updates**: Manual crawler execution required
- **Basic Categorization**: Simple keyword-based job classification
- **No Job Deduplication**: Same job from different sources not merged
