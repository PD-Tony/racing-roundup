import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { format } from 'date-fns';
import Layout from '../../components/layout/Layout';
import ArticleList from '../../components/articles/ArticleList';

interface Article {
  _id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: 'F1' | 'MotoGP' | 'Other';
  imageUrl?: string;
}

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!slug) return;
    
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const category = slug === 'f1' ? 'F1' : slug === 'motogp' ? 'MotoGP' : '';
        
        if (!category) {
          router.push('/404');
          return;
        }
        
        const response = await axios.get(`/api/articles?category=${category}`);
        setArticles(response.data.articles || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
    
    // Set up polling for new articles every 5 minutes
    const interval = setInterval(fetchArticles, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [slug, router]);
  
  const getCategoryTitle = () => {
    if (slug === 'f1') return 'Formula 1';
    if (slug === 'motogp') return 'MotoGP';
    return 'Racing News';
  };
  
  const getCategoryDescription = () => {
    if (slug === 'f1') return 'The latest news and updates from the world of Formula 1 racing';
    if (slug === 'motogp') return 'Stay up to date with the latest MotoGP news and developments';
    return 'The latest motorsport news and updates';
  };

  return (
    <Layout 
      title={`${getCategoryTitle()} News - Racing Roundup`}
      description={getCategoryDescription()}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{getCategoryTitle()} News</h1>
        <p className="text-gray-600">{getCategoryDescription()}</p>
        <div className="mt-4 text-sm text-gray-500">
          Last updated: {format(new Date(), 'dd/MM/yyyy HH:mm:ss')}
        </div>
      </div>

      <ArticleList articles={articles} loading={loading} />
    </Layout>
  );
}
