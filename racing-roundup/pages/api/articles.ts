import type { NextApiRequest, NextApiResponse } from 'next';
import { mockArticles } from '../../lib/mockData';

// Attempt to import MongoDB models, but fallback to mock data if they don't exist
let dbConnect: any;
let Article: any;

try {
  dbConnect = require('../../lib/dbConnect').default;
  Article = require('../../lib/models/Article').default;
} catch (error) {
  console.log('MongoDB connection not available, using mock data');
}

type Data = {
  success: boolean;
  articles?: any[];
  message?: string;
  total?: number;
  data?: any; // Added to fix lint error
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  // Only try to connect to MongoDB if the connection is available
  let useMockData = false;
  if (typeof dbConnect === 'function') {
    try {
      await dbConnect();
      console.log('Successfully connected to MongoDB');
      useMockData = false;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      useMockData = true;
    }
  } else {
    console.error('dbConnect function not available');
    useMockData = true;
  }

  switch (method) {
    case 'GET':
      try {
        // Get query parameters for filtering
        const { category, limit = '12', page = '1' } = req.query;
        
        // Parse pagination parameters
        const limitNum = parseInt(String(limit), 10);
        const pageNum = parseInt(String(page), 10);
        const skip = (pageNum - 1) * limitNum;
        
        if (useMockData) {
          // Use mock data
          let filteredArticles = category 
            ? mockArticles.filter(article => 
                article.category.toLowerCase() === String(category).toLowerCase())
            : mockArticles;
          
          // Sort by publication date, newest first
          filteredArticles = [...filteredArticles].sort((a, b) => 
            new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
          );
          
          // Apply pagination
          const paginatedArticles = filteredArticles.slice(skip, skip + limitNum);
          const total = filteredArticles.length;
          
          res.status(200).json({
            success: true,
            articles: paginatedArticles,
            total,
            pagination: {
              total,
              page: pageNum,
              limit: limitNum,
              pages: Math.ceil(total / limitNum)
            }
          });
        } else {
          // Use MongoDB
          // Build query
          const query = category ? { category: { $regex: new RegExp(String(category), 'i') } } : {};
          
          console.log('Fetching articles from MongoDB with query:', query);
          
          // Fetch articles with pagination
          const articles = await Article.find(query)
            .sort({ pubDate: -1 }) // Most recent first
            .skip(skip)
            .limit(limitNum);
          
          // Get total count for pagination
          const total = await Article.countDocuments(query);
          
          console.log(`Found ${total} articles in database, returning ${articles.length} articles`);
          console.log('First article title:', articles.length > 0 ? articles[0].title : 'No articles found');
          
          res.status(200).json({
            success: true,
            articles,
            total,
            pagination: {
              total,
              page: pageNum,
              limit: limitNum,
              pages: Math.ceil(total / limitNum)
            }
          });
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Failed to fetch articles' 
        });
      }
      break;
      
    case 'POST':
      // This endpoint would be used by the admin panel or automated scripts
      // to add new articles to the database
      try {
        // Check for API key or other authentication
        // This is a simplified example - implement proper auth in production
        const apiKey = req.headers['x-api-key'];
        if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
          return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        
        if (useMockData) {
          // We can't actually save to mock data, so just return a success message
          res.status(201).json({ 
            success: true, 
            message: 'Article created in mock mode (not actually saved)' 
          });
        } else {
          // Save to MongoDB
          const article = await Article.create(req.body);
          res.status(201).json({ success: true, data: article });
        }
      } catch (error) {
        console.error('Error creating article:', error);
        res.status(400).json({ success: false, message: 'Failed to create article' });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
  }
}
