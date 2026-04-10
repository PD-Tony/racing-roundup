import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Article from '../../../lib/models/Article';
import { mockArticles } from '../../../lib/mockData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, category, limit = 3 } = req.query;
  
  if (req.method === 'GET') {
    try {
      console.log(`Fetching related articles for article ID: ${id}, category: ${category}`);
      
      // Connect to the database
      await dbConnect();
      console.log('Successfully connected to MongoDB');
      
      // Find related articles (same category, different ID)
      let relatedArticles = await Article.find({ 
        _id: { $ne: id },
        category: category
      })
      .sort({ pubDate: -1 })
      .limit(Number(limit));
      
      if (relatedArticles && relatedArticles.length > 0) {
        console.log(`Found ${relatedArticles.length} related articles from database`);
        return res.status(200).json({ 
          success: true, 
          articles: relatedArticles
        });
      } else {
        console.log(`No related articles found in database, using mock data`);
        
        // If not found in database, use mock data as fallback
        const mockRelated = mockArticles
          .filter(article => article.category === category && article._id !== id)
          .slice(0, Number(limit));
        
        if (mockRelated.length > 0) {
          console.log(`Found ${mockRelated.length} mock related articles`);
          return res.status(200).json({ 
            success: true, 
            articles: mockRelated,
            isMock: true
          });
        } else {
          console.log(`No related articles found in mock data either`);
          return res.status(200).json({ 
            success: true, 
            articles: [],
            message: 'No related articles found'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching related articles',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  } else {
    // Only GET method is allowed
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} Not Allowed` 
    });
  }
}
