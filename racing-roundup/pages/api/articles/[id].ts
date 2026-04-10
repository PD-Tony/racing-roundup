import type { NextApiRequest, NextApiResponse } from 'next';
import { getArticleById } from '../../../lib/mockData';

type Data = {
  success: boolean;
  article?: any;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // Get the article ID from the URL
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Article ID is required',
      });
    }

    // Find the article by ID from mock data
    const article = getArticleById(id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Return successful response
    res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the article',
    });
  }
}
