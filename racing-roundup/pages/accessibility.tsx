import React from 'react';
import Layout from '../components/layout/Layout';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function Accessibility() {
  const { darkMode } = useTheme();
  
  return (
    <Layout 
      title="Accessibility Statement - Racing Roundup"
      description="Accessibility Statement for Racing Roundup - Your source for F1 and MotoGP news."
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Accessibility Statement</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Last updated: 03/04/2025
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Our Commitment</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Racing Roundup is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-6 dark:text-white">Measures Taken</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We have taken the following measures to ensure accessibility:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4 pl-4">
            <li>Include proper alt text for all images</li>
            <li>Provide appropriate contrast ratios for text</li>
            <li>Ensure keyboard navigation is possible</li>
            <li>Use semantic HTML elements</li>
            <li>Implement dark mode for users with light sensitivity</li>
            <li>Include ARIA attributes where appropriate</li>
            <li>Ensure responsive design for various devices</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mb-4 mt-6 dark:text-white">Conformance Status</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. Racing Roundup strives to conform to WCAG 2.1 level AA standards.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-6 dark:text-white">Feedback</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We welcome your feedback on the accessibility of Racing Roundup. Please let us know if you encounter accessibility barriers:
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
