// Script to fetch racing news articles and populate the MongoDB database
const Parser = require('rss-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const stringSimilarity = require('string-similarity');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/racing-roundup';

// Define the Article schema directly in this script to avoid TypeScript compilation issues
const ArticleSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true,
      trim: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    content: { 
      type: String 
    },
    link: { 
      type: String, 
      required: true,
      unique: true 
    },
    pubDate: { 
      type: Date, 
      required: true 
    },
    source: { 
      type: String, 
      required: true 
    },
    sourceId: { 
      type: String 
    },
    category: { 
      type: String, 
      enum: ['F1', 'MotoGP', 'Other'],
      required: true 
    },
    imageUrl: { 
      type: String 
    },
    tags: [{ 
      type: String 
    }],
    author: { 
      type: String 
    },
    isProcessed: { 
      type: Boolean, 
      default: false 
    },
    containsRaceResults: {
      type: Boolean,
      default: false
    },
    containsQualifyingResults: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true 
  }
);

// Create indexes for better query performance
ArticleSchema.index({ pubDate: -1 });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ source: 1 });

// Prevent duplicate articles based on link
ArticleSchema.index({ link: 1 }, { unique: true });

// Method to format dates in UK format (DD/MM/YYYY)
ArticleSchema.methods.formatDate = function() {
  const date = this.pubDate;
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Create the Article model
const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema);

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
    url: 'https://www.crash.net/rss/motogp',
    category: 'MotoGP',
  },
  {
    name: 'Crash.net MotoGP',
    url: 'https://www.crash.net/rss/motogp',
    category: 'MotoGP',
  },
  {
    name: 'BBC F1',
    url: 'https://feeds.bbci.co.uk/sport/formula1/rss.xml',
    category: 'F1',
  },
  {
    name: 'Formula 1',
    url: 'https://www.formula1.com/content/fom-website/en/latest/all.xml',
    category: 'F1',
  }
];

const DUPLICATE_SIMILARITY_THRESHOLD = 0.85; // Adjust as needed (e.g., 0.8 = 80%)
const DUPLICATE_CHECK_WINDOW_HOURS = 24; // Check against articles from the last 24 hours

// Function to detect if an article contains race or qualifying results
function detectResultsContent(title, content) {
  const raceResultsKeywords = [
    'race result', 'race results', 'grand prix result', 'grand prix results',
    'wins', 'victory', 'podium', 'classified', 'standings', 'championship table',
    'finished first', 'finished second', 'finished third', 'classified',
    'race winner', 'race classification', 'full result', 'full results'
  ];
  
  const qualifyingResultsKeywords = [
    'qualifying result', 'qualifying results', 'pole position', 'grid',
    'qualifying session', 'q1 result', 'q2 result', 'q3 result',
    'front row', 'back of the grid', 'qualifying classification'
  ];
  
  const titleAndContent = (title + ' ' + (content || '')).toLowerCase();
  
  const containsRaceResults = raceResultsKeywords.some(keyword => 
    titleAndContent.includes(keyword)
  );
  
  const containsQualifyingResults = qualifyingResultsKeywords.some(keyword => 
    titleAndContent.includes(keyword)
  );
  
  return {
    containsRaceResults,
    containsQualifyingResults
  };
}

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
  
  let totalArticlesAdded = 0;
  let f1ArticlesAdded = 0;
  let motoGPArticlesAdded = 0;
  
  for (const source of newsSources) {
    try {
      console.log(`Fetching from ${source.name}...`);
      const feed = await parser.parseURL(source.url);
      
      for (const item of feed.items) {
        try {
          // --- Duplicate Check Start ---
          let isDuplicate = false;
          const timeWindowDate = new Date(Date.now() - DUPLICATE_CHECK_WINDOW_HOURS * 60 * 60 * 1000);
          
          // Find titles of recent articles
          const recentArticles = await Article.find(
            { pubDate: { $gte: timeWindowDate } }, 
            'title' // Select only the title field
          ).lean(); // Use lean for performance

          for (const recentArticle of recentArticles) {
            const similarity = stringSimilarity.compareTwoStrings(item.title, recentArticle.title);
            if (similarity >= DUPLICATE_SIMILARITY_THRESHOLD) {
              console.log(`Skipping potential duplicate (Similarity: ${(similarity * 100).toFixed(1)}%): "${item.title}" vs "${recentArticle.title}"`);
              isDuplicate = true;
              break; // Found a duplicate, no need to check further
            }
          }
          // --- Duplicate Check End ---
          
          // Only proceed if not flagged as a duplicate
          if (!isDuplicate) {
            // Prepare article data
            let imageUrl = null;
            if (item.enclosure && item.enclosure.url) {
              imageUrl = item.enclosure.url;
            } else {
              imageUrl = await extractImageFromArticle(item.link);
            }
            if (!imageUrl) {
              const randomNum = Math.floor(Math.random() * 1000);
              imageUrl = `https://picsum.photos/800/600?random=${randomNum}`;
            }
            
            const { containsRaceResults, containsQualifyingResults } = detectResultsContent(
              item.title, 
              item.content || item.contentSnippet || ''
            );
            
            const articleData = {
              title: item.title,
              description: item.contentSnippet || item.summary || '',
              content: item.content || '',
              link: item.link,
              pubDate: item.pubDate ? new Date(item.pubDate) : await extractPublicationDate(item.link) || new Date(),
              source: source.name,
              category: source.category,
              imageUrl: imageUrl,
              author: item.creator || item.author || '',
              isProcessed: true,
              containsRaceResults,
              containsQualifyingResults
            };
            
            // Use updateOne with upsert: true and $setOnInsert
            const result = await Article.updateOne(
              { link: articleData.link },
              { $setOnInsert: articleData },
              { upsert: true }
            );
            
            // Check if a new document was inserted
            if (result.upsertedCount > 0) {
              console.log(`Inserted new article: ${articleData.title}`);
              totalArticlesAdded++;
              if (source.category === 'F1') {
                f1ArticlesAdded++;
              } else if (source.category === 'MotoGP') {
                motoGPArticlesAdded++;
              }
            } else if (result.matchedCount > 0) {
              // console.log(`Article already exists: ${articleData.title}`);
            } else {
              console.warn(`UpdateOne result unclear for: ${articleData.title}`, result);
            }
          } // End of if (!isDuplicate)
          
        } catch (error) {
          if (error.code === 11000) {
            console.warn(`Skipped duplicate article (concurrent upsert?): ${item.title}`);
          } else {
            console.error(`Error processing article ${item.title}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching feed from ${source.name}:`, error.message);
    }
  }
  
  console.log('Finished processing news feeds');
  console.log(`Total new articles added: ${totalArticlesAdded}`);
  console.log(`New F1 articles added: ${f1ArticlesAdded}`);
  console.log(`New MotoGP articles added: ${motoGPArticlesAdded}`);
}

// Main function to run the script
async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Fetch and process feeds
    await fetchAndProcessFeeds();
    
    console.log('News fetch completed successfully');
  } catch (error) {
    console.error('Error in news fetch process:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}

// Run the script
main();
