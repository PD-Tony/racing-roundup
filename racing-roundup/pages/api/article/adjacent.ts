import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Article from '../../../lib/models/Article';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { id, category } = req.query;

  if (!id || typeof id !== 'string' || !category || typeof category !== 'string') {
    return res.status(400).json({ success: false, message: 'Missing or invalid id or category parameter' });
  }

  try {
    await dbConnect();

    // Find the current article to get its publication date
    const currentArticle = await Article.findById(id).select('pubDate').lean();

    if (!currentArticle) {
      return res.status(404).json({ success: false, message: 'Current article not found' });
    }

    // Assert type here as .lean() can sometimes confuse TS, but we selected pubDate
    const currentPubDate = new Date((currentArticle as unknown as { pubDate: string }).pubDate);

    // Find the previous article in the same category
    const previousArticle = await Article.findOne({
      category: category,
      pubDate: { $lt: currentPubDate }
    })
    .sort({ pubDate: -1 }) // Sort descending to get the closest previous date
    .select('_id title')   // Only select necessary fields
    .lean();

    // Find the next article in the same category
    const nextArticle = await Article.findOne({
      category: category,
      pubDate: { $gt: currentPubDate }
    })
    .sort({ pubDate: 1 })  // Sort ascending to get the closest next date
    .select('_id title')  // Only select necessary fields
    .lean();

    res.status(200).json({ 
      success: true, 
      previous: previousArticle || null, 
      next: nextArticle || null 
    });

  } catch (error) {
    console.error('Error fetching adjacent articles:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
