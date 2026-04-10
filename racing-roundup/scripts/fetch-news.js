const Parser = require('rss-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/racing-roundup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import Article model
// Since we're using TypeScript for the model, we need to use a different approach
let Article;
try {
  Article = require('../lib/models/Article').default;
} catch (error) {
  // If the compiled JS version doesn't exist yet, inform the user
  console.error('Error loading Article model. Make sure you have built the TypeScript files.');
  console.error('Try running: npm run build');
  process.exit(1);
}

// Initialize RSS parser
const parser = new Parser();

// Define news sources with their RSS feeds
const newsSources = [
  {
    name: 'Autosport',
    url: 'https://www.autosport.com/rss/feed/f1',
    category: 'F1',
  },
  {
    name: 'Motorsport',
    url: 'https://www.motorsport.com/rss/f1/news/',
    category: 'F1',
  },
  {
    name: 'Crash.net F1',
    url: 'https://www.crash.net/rss/f1',
    category: 'F1',
  },
  {
    name: 'MotoGP',
    url: 'https://www.motogp.com/en/news/rss',
    category: 'MotoGP',
  },
  {
    name: 'Crash.net MotoGP',
    url: 'https://www.crash.net/rss/motogp',
    category: 'MotoGP',
  },
];

// Function to extract image from article content
async function extractImageFromArticle(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Look for the first image in the article content
    // This is a simple implementation - adjust selectors based on target sites
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) return ogImage;
    
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    if (twitterImage) return twitterImage;
    
    const firstImage = $('article img').first().attr('src');
    if (firstImage) return firstImage;
    
    return null;
  } catch (error) {
    console.error(`Error extracting image from ${url}:`, error.message);
    return null;
  }
}

// Function to extract publication date from article HTML
async function extractPublicationDate(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Try different meta tags that might contain the publication date
    // 1. Open Graph article published time
    const ogPublishedTime = $('meta[property="article:published_time"]').attr('content');
    if (ogPublishedTime) return new Date(ogPublishedTime);
    
    // 2. Schema.org published date in JSON-LD
    const jsonLdScripts = $('script[type="application/ld+json"]');
    if (jsonLdScripts.length > 0) {
      for (let i = 0; i < jsonLdScripts.length; i++) {
        try {
          const jsonLd = JSON.parse($(jsonLdScripts[i]).html());
          if (jsonLd.datePublished) return new Date(jsonLd.datePublished);
          if (jsonLd.publishedDate) return new Date(jsonLd.publishedDate);
          if (jsonLd.dateCreated) return new Date(jsonLd.dateCreated);
          
          // Handle array of items (like BreadcrumbList)
          if (jsonLd['@graph'] && Array.isArray(jsonLd['@graph'])) {
            for (const item of jsonLd['@graph']) {
              if (item.datePublished) return new Date(item.datePublished);
              if (item.publishedDate) return new Date(item.publishedDate);
              if (item.dateCreated) return new Date(item.dateCreated);
            }
          }
        } catch (e) {
          console.error('Error parsing JSON-LD:', e.message);
        }
      }
    }
    
    // 3. Common date meta tags
    const metaPublishedTime = $('meta[name="published_time"]').attr('content') || 
                             $('meta[name="date"]').attr('content') || 
                             $('meta[name="publication-date"]').attr('content') ||
                             $('meta[name="publish-date"]').attr('content');
    if (metaPublishedTime) return new Date(metaPublishedTime);
    
    // 4. Look for time elements with datetime attribute
    const timeElement = $('time[datetime]').first().attr('datetime');
    if (timeElement) return new Date(timeElement);
    
    // 5. Look for common date patterns in the HTML
    // This is more site-specific and might need adjustments
    const dateClasses = ['.date', '.published', '.post-date', '.article-date', '.entry-date'];
    for (const dateClass of dateClasses) {
      const dateText = $(dateClass).first().text().trim();
      if (dateText) {
        const parsedDate = new Date(dateText);
        if (!isNaN(parsedDate.getTime())) return parsedDate;
      }
    }
    
    // If we couldn't find a date, return null
    return null;
  } catch (error) {
    console.error(`Error extracting publication date from ${url}:`, error.message);
    return null;
  }
}

// Function to fetch and process RSS feeds
async function fetchAndProcessFeeds() {
  console.log('Starting to fetch news feeds...');
  
  for (const source of newsSources) {
    try {
      console.log(`Fetching from ${source.name}...`);
      const feed = await parser.parseURL(source.url);
      
      for (const item of feed.items) {
        try {
          // Check if article already exists
          const existingArticle = await Article.findOne({ link: item.link });
          if (existingArticle) {
            console.log(`Article already exists: ${item.title}`);
            continue;
          }
          
          // Extract image if available
          let imageUrl = null;
          if (item.enclosure && item.enclosure.url) {
            imageUrl = item.enclosure.url;
          } else {
            imageUrl = await extractImageFromArticle(item.link);
          }
          
          // Create new article
          const article = new Article({
            title: item.title,
            description: item.contentSnippet || item.summary || '',
            content: item.content || '',
            link: item.link,
            // Try to get the publication date from multiple sources in order of reliability:
            // 1. RSS feed pubDate
            // 2. Extract from article HTML
            // 3. Current date as last resort
            pubDate: item.pubDate ? new Date(item.pubDate) : await extractPublicationDate(item.link) || new Date(),
            source: source.name,
            category: source.category,
            imageUrl: imageUrl,
            author: item.creator || item.author || '',
            isProcessed: false,
          });
          
          await article.save();
          console.log(`Saved new article: ${item.title}`);
        } catch (error) {
          console.error(`Error processing article ${item.title}:`, error.message);
        }
      }
    } catch (error) {
      console.error(`Error fetching feed from ${source.name}:`, error.message);
    }
  }
  
  console.log('Finished fetching news feeds');
}

// Run the fetcher
fetchAndProcessFeeds()
  .then(() => {
    console.log('News fetch completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error in news fetch process:', error);
    process.exit(1);
  });
