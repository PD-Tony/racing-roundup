import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Article } from '../../types';
import type { ArticleCardProps } from '../../types';

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [imageError, setImageError] = useState(false);
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Ensure UK date/time format
      return format(date, 'dd/MM/yyyy HH:mm:ss');
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      // Fallback to just showing the string if formatting fails
      return dateString;
    }
  };
  
  // Generate a fallback image URL if the original image fails to load
  const getFallbackImageUrl = () => {
    // Use a placeholder image with a random number to avoid caching issues
    const randomNum = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/800/450?random=${randomNum}`;
  };

  // Determine category badge styles, including dark mode
  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'F1':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'MotoGP':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  return (
    // Added flex, flex-col, h-full to make the card a flex container and take full height of its grid cell
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/article/${article._id}`} aria-label={`Read more about ${article.title}`}>
        <div className="h-48 overflow-hidden relative cursor-pointer">
          {article.imageUrl && !imageError ? (
            <Image 
              src={article.imageUrl} 
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              priority={false} // Keep priority low for list items
              onError={() => setImageError(true)}
              unoptimized={true} // Consider if optimization is needed later
            />
          ) : (
            <Image 
              src={getFallbackImageUrl()} 
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              priority={false}
              unoptimized={true}
            />
          )}
        </div>
      </Link>
      {/* Added flex, flex-col, flex-grow to make this section expand */}
      <div className="p-4 dark:text-gray-100 flex flex-col flex-grow">
        {/* Added flex-grow to this wrapper div */}
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${getCategoryBadgeStyle(article.category)}`}>
              {article.category}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(article.pubDate)}
            </span>
          </div>
          <Link href={`/article/${article._id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {/* Increased line clamp slightly for potentially longer titles */}
            <h2 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2">{article.title}</h2>
          </Link>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{article.description}</p>
        </div>
        {/* This div contains the button and will be pushed to the bottom */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <Link 
            href={`/article/${article._id}`}
            className="w-full px-3 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600 flex items-center justify-center shadow-sm"
            aria-label={`Read more about ${article.title}`}
          >
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
