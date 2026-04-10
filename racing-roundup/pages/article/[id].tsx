import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { Article } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AdjacentArticleLink {
  _id: string;
  title: string;
}

export default function ArticleDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [previousArticle, setPreviousArticle] = useState<AdjacentArticleLink | null>(null);
  const [nextArticle, setNextArticle] = useState<AdjacentArticleLink | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [relatedLoading, setRelatedLoading] = useState<boolean>(true);
  const [adjacentLoading, setAdjacentLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    setArticle(null);
    setRelatedArticles([]);
    setPreviousArticle(null);
    setNextArticle(null);
    setLoading(true);
    setRelatedLoading(true);
    setAdjacentLoading(true);
    setError(null);
    setImageError(false);

    const fetchArticleAndAdjacent = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/article/${id}`);
        const data = await response.json();

        if (data.success && data.article) {
          setArticle(data.article);
          fetchRelatedArticles(data.article.category);
          fetchAdjacentArticles(data.article._id, data.article.category);
        } else {
          setError(data.message || 'Failed to fetch article');
          setLoading(false);
          setAdjacentLoading(false);
        }
      } catch (err) {
        setError('Error fetching article data');
        console.error('Error fetching article:', err);
        setLoading(false);
        setAdjacentLoading(false);
      }
    };

    const fetchRelatedArticles = async (category: string) => {
      try {
        setRelatedLoading(true);
        const response = await fetch(`/api/article/related?id=${id}&category=${category}&limit=3`);
        const data = await response.json();

        if (data.success) {
          setRelatedArticles(data.articles);
        }
      } catch (err) {
        console.error('Error fetching related articles:', err);
      } finally {
        setRelatedLoading(false);
      }
    };

    const fetchAdjacentArticles = async (currentId: string, category: string) => {
      try {
        setAdjacentLoading(true);
        const response = await fetch(`/api/article/adjacent?id=${currentId}&category=${category}`);
        const data = await response.json();

        if (data.success) {
          setPreviousArticle(data.previous);
          setNextArticle(data.next);
        } else {
          console.error('Failed to fetch adjacent articles:', data.message);
        }
      } catch (err) {
        console.error('Error fetching adjacent articles:', err);
      } finally {
        setAdjacentLoading(false);
        setLoading(false);
      }
    };

    fetchArticleAndAdjacent();
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm:ss');
    } catch (error) {
      return dateString;
    }
  };

  const getFallbackImageUrl = () => {
    const randomNum = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/800/450?random=${randomNum}`;
  };

  const getArticleCategoryClass = (category: string) => {
    switch (category) {
      case 'F1':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'MotoGP':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <Layout title="Loading Article | Racing Roundup">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout title="Article Not Found | Racing Roundup">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            {error || 'Article not found'}
          </h1>
          <p className="mb-6 dark:text-gray-300">
            Sorry, we couldn't find the article you're looking for.
          </p>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${article.title} | Racing Roundup`}
      description={article.description}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Articles
          </Link>
        </div>

        {/* Article category */}
        <div className="mb-4">
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              article.category === 'F1'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : article.category === 'MotoGP'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {article.category}
          </span>
        </div>

        {/* Article title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
          {article.title}
        </h1>

        {/* Article metadata */}
        <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          <span className="mr-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Published: {formatDate(article.pubDate)}
          </span>
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5a2 2 0 00-2 2v12a2 2 0 002 2h5z"
              />
            </svg>
            Source: {article.source}
          </span>
        </div>

        {/* Article image */}
        <div className="mb-8 rounded-lg overflow-hidden relative h-[300px] md:h-[400px]">
          {article.imageUrl && !imageError ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
              style={{ objectFit: 'cover' }}
              priority={true}
              onError={() => setImageError(true)}
              unoptimized={true}
            />
          ) : (
            <Image
              src={getFallbackImageUrl()}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
              style={{ objectFit: 'cover' }}
              priority={true}
              unoptimized={true}
            />
          )}
        </div>

        {/* Article content */}
        <div className="prose prose-lg max-w-none dark:prose-invert dark:text-gray-300 mb-8">
          <p className="text-lg leading-relaxed mb-6">{article.description}</p>

          {/* Extended content preview */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Article Summary</h2>
            <p className="text-lg leading-relaxed mb-4">
              {article.description.split('.').slice(0, 1).join('.')}.{' '}
              {article.category === 'F1'
                ? 'Formula 1 continues to be at the forefront of motorsport innovation and competition. Teams are constantly pushing the boundaries of technology and performance to gain even the smallest advantage on track.'
                : article.category === 'MotoGP'
                ? 'MotoGP showcases the pinnacle of motorcycle racing with riders demonstrating incredible skill and bravery at speeds exceeding 350 km/h. The combination of rider talent and engineering excellence makes it one of the most exciting motorsports.'
                : 'Motorsport remains one of the most technically advanced and competitive sporting arenas in the world, combining human skill with cutting-edge technology and engineering.'}
            </p>
            <p className="text-lg leading-relaxed mb-4">
              {article.category === 'F1'
                ? 'Recent developments in aerodynamics, power unit efficiency, and tyre management continue to reshape the competitive landscape of Formula 1. Teams are investing heavily in simulation and data analysis to optimize performance across different track conditions.'
                : article.category === 'MotoGP'
                ? 'The latest generation of MotoGP machines feature sophisticated electronics, aerodynamics packages, and mechanical grip solutions that help riders extract maximum performance. The balance between rider input and technical setup remains crucial for success.'
                : 'The evolution of racing technology has accelerated in recent years, with advancements in materials science, computational fluid dynamics, and power delivery systems all contributing to faster, safer, and more efficient racing machines.'}
            </p>
          </div>

          {/* Key points section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8 border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold mb-3 dark:text-white">Key Points</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>This article was originally published by {article.source} on {formatDate(article.pubDate)}.</li>
              <li>The full article contains additional details, analysis, and expert opinions.</li>
              <li>Racing Roundup provides this preview as a convenience to our readers.</li>
              <li>For the complete story and exclusive content, please visit the original source using the link below.</li>
            </ul>
          </div>
        </div>

        {/* Original source link - Commented out to keep users on the site */}
        {/* <div className="mb-12 text-center">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            aria-label={`Read the full article about ${article.title} on ${article.source}`}
          >
            Read Full Article on {article.source}
          </a>
        </div> */}

        {/* Related articles section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">You might also like</h2>

          {relatedLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          ) : relatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <div key={relatedArticle._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <Link href={`/article/${relatedArticle._id}`} className="block">
                    <div className="h-40 overflow-hidden relative">
                      {relatedArticle.imageUrl ? (
                        <Image
                          src={relatedArticle.imageUrl}
                          alt={relatedArticle.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                          style={{ objectFit: 'cover' }}
                          unoptimized={true}
                        />
                      ) : (
                        <Image
                          src={getFallbackImageUrl()}
                          alt={relatedArticle.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                          style={{ objectFit: 'cover' }}
                          unoptimized={true}
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${getArticleCategoryClass(
                          relatedArticle.category
                        )}`}
                      >
                        {relatedArticle.category}
                      </span>
                      <h3 className="text-lg font-semibold mt-2 mb-1 line-clamp-2 dark:text-white">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {formatDate(relatedArticle.pubDate)}
                        </span>
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No related articles found at this time.
            </p>
          )}
        </div>

        {/* --- Next/Previous Navigation --- */}
        {!adjacentLoading && (previousArticle || nextArticle) && (
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-start flex-wrap gap-4">
            {previousArticle ? (
              <Link
                href={`/article/${previousArticle._id}`}
                className="group text-left text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span className="text-xs text-gray-500 dark:text-gray-500 block">Previous Article</span>
                <span className="inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 transform transition-transform group-hover:-translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <span className="font-medium line-clamp-1">{previousArticle.title}</span>
                </span>
              </Link>
            ) : (
              <div /> // Placeholder to maintain alignment if only next exists
            )}

            {nextArticle ? (
              <Link
                href={`/article/${nextArticle._id}`}
                className="group text-right text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span className="text-xs text-gray-500 dark:text-gray-500 block">Next Article</span>
                <span className="inline-flex items-center">
                  <span className="font-medium line-clamp-1">{nextArticle.title}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </Link>
            ) : (
              <div /> // Placeholder to maintain alignment if only previous exists
            )}
          </div>
        )}
        {/* --- End Next/Previous Navigation --- */}

        {/* --- Bottom Back Button --- */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Articles
          </Link>
        </div>
        {/* --- End Bottom Back Button --- */}
      </div>
    </Layout>
  );
}
