import React from 'react';
import Layout from '../components/layout/Layout';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function Terms() {
  const { darkMode } = useTheme();
  
  return (
    <Layout 
      title="Terms of Use - Racing Roundup"
      description="Terms of Use for Racing Roundup - Your source for F1 and MotoGP news."
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Terms of Use</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Last updated: 03/04/2025
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Introduction</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            These Terms of Use govern your use of the Racing Roundup website. By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the website.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-6 dark:text-white">Intellectual Property</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The content on Racing Roundup, including text, graphics, logos, and images, is the property of Racing Roundup or its content suppliers and is protected by UK and international copyright laws.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-6 dark:text-white">External Links</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Racing Roundup may contain links to external websites that are not operated by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-6 dark:text-white">Disclaimer</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Racing Roundup is not affiliated with Formula 1, MotoGP, or any racing teams. All trademarks are property of their respective owners. The information provided on our website is for general informational purposes only.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-6 dark:text-white">Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <a href="mailto:contact@racingroundup.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              contact@racingroundup.com
            </a>
          </p>
        </div>
        
        <div className="text-center mb-8">
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
            Return to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
