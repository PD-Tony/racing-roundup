import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Article from '../../../lib/models/Article';
import { mockArticles, getArticleById } from '../../../lib/mockData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    try {
      console.log(`Fetching article with ID: ${id}`);
      
      // Connect to the database
      await dbConnect();
      console.log('Successfully connected to MongoDB');
      
      // Find the article by ID
      const article = await Article.findById(id);
      
      if (article) {
        console.log(`Found article: ${article.title}`);
        return res.status(200).json({ 
          success: true, 
          article 
        });
      } else {
        console.log(`Article with ID ${id} not found in database, checking mock data`);
        
        // If not found in database, try mock data as fallback
        const mockArticle = getArticleById(id as string);
        
        if (mockArticle) {
          console.log(`Found mock article: ${mockArticle.title}`);
          return res.status(200).json({ 
            success: true, 
            article: mockArticle,
            isMock: true
          });
        } else {
          console.log(`Article with ID ${id} not found in mock data either`);
          return res.status(404).json({ 
            success: false, 
            message: 'Article not found' 
          });
        }
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching article',
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
