import React from 'react';
import Layout from '../components/layout/Layout';
import Link from 'next/link';

export default function About() {
  return (
    <Layout 
      title="About Racing Roundup - F1 and MotoGP News"
      description="Learn more about Racing Roundup, your one-stop destination for Formula 1 and MotoGP news."
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">About Racing Roundup</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Racing Roundup was created with a simple mission: to provide motorsport enthusiasts with a centralised hub for all Formula 1 and MotoGP news. We understand that keeping up with the fast-paced world of motorsport can be challenging, with news scattered across numerous websites and platforms.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Our automated news aggregation system collects the latest articles from trusted sources, categorises them, and presents them in a clean, user-friendly format. This allows you to stay informed about your favourite racing series without having to visit multiple websites.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">How It Works</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Racing Roundup uses advanced technology to automatically collect and process news articles:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li>Our system regularly scans trusted motorsport news sources for new content</li>
            <li>Articles are categorised as Formula 1, MotoGP, or other relevant categories</li>
            <li>Duplicate stories are detected and filtered out</li>
            <li>Content is presented in a clean, accessible format for easy reading</li>
            <li>Articles are updated throughout the day to ensure you have the latest news</li>
          </ol>
          <p className="text-gray-700 dark:text-gray-300">
            All of this happens automatically, ensuring you always have access to the most current racing news.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Our Sources</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We aggregate content from respected motorsport news sources, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li>Autosport</li>
            <li>Motorsport.com</li>
            <li>Crash.net</li>
            <li>Official Formula 1 website</li>
            <li>Official MotoGP website</li>
            <li>And many more trusted sources</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300">
            We always provide attribution and links to the original articles, respecting the hard work of journalists and content creators.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Future Plans</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Racing Roundup is constantly evolving. We have exciting plans for the future, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li><strong className="dark:text-white">No-Spoiler Mode</strong> - A feature that detects when articles contain race or qualifying results and provides a spoiler warning for users who haven't watched the event yet</li>
            <li>Personalised news feeds based on your interests</li>
            <li>Live race weekend hubs with timing and updates</li>
            <li>Community features for discussing races and news</li>
            <li>Enhanced content analysis with technical explainers</li>
            <li>Mobile apps for iOS and Android</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300">
            Stay tuned as we continue to improve and expand Racing Roundup!
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We value your feedback and suggestions. If you have any questions, comments, or ideas for improving Racing Roundup, please don't hesitate to get in touch.
          </p>
          <div className="flex space-x-4">
            <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
