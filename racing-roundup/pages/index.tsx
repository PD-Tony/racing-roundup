import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { mockArticles } from '../lib/mockData';
import Layout from '../components/layout/Layout';
import ArticleList from '../components/articles/ArticleList';
import { Article } from '../types';
import dynamic from 'next/dynamic';

// Use the Article interface from types.ts

// Create a client-only component for the timestamp to avoid hydration errors
const ClientOnlyTimestamp = dynamic(() => Promise.resolve(() => {
  const [currentTime, setCurrentTime] = useState(format(new Date(), 'dd/MM/yyyy HH:mm:ss'));
  
  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'dd/MM/yyyy HH:mm:ss'));
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="text-sm text-gray-500 dark:text-gray-400">
      Last updated: {currentTime}
    </div>
  );
}), { ssr: false });

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    // Fetch articles from the API
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // Use the API endpoint instead of direct mock data
        const response = await fetch('/api/articles');
        const data = await response.json();
        
        if (data.success) {
          console.log(`Loaded ${data.articles.length} articles from database`);
          setArticles(data.articles);
        } else {
          console.error('Failed to fetch articles:', data.message);
          // Only use mock data as a last resort
          console.warn('Using mock data as fallback');
          setArticles(mockArticles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        // Only use mock data as a last resort
        console.warn('Using mock data as fallback');
        setArticles(mockArticles);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);
  
  const filteredArticles = articles.filter(article => {
    if (filter === 'all') return true;
    return article.category.toLowerCase() === filter.toLowerCase();
  });
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm:ss');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
          >
            All News
          </button>
          <button 
            onClick={() => setFilter('f1')}
            className={`px-4 py-2 rounded-md transition-colors ${filter === 'f1' ? 'bg-red-600 text-white' : 'bg-white dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
          >
            Formula 1
          </button>
          <button 
            onClick={() => setFilter('motogp')}
            className={`px-4 py-2 rounded-md transition-colors ${filter === 'motogp' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
          >
            MotoGP
          </button>
        </div>
        <ClientOnlyTimestamp />
      
      </div>

      <ArticleList articles={filteredArticles} loading={loading} />
    </Layout>
  );
}
