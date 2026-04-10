import React from 'react';
import Layout from '../components/layout/Layout';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function Privacy() {
  const { darkMode } = useTheme();
  
  return (
    <Layout 
      title="Privacy Policy - Racing Roundup"
      description="Privacy Policy for Racing Roundup - Your source for F1 and MotoGP news."
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Privacy Policy</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Last updated: 03/04/2025
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Introduction</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Racing Roundup ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-6 dark:text-white">Information We Collect</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We may collect certain information when you interact with our website:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4 pl-4">
            <li>Usage data (pages visited, time spent on site)</li>
            <li>Device information (browser type, operating system)</li>
            <li>IP address and location data</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mb-4 mt-6 dark:text-white">How We Use Your Information</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4 pl-4">
            <li>Provide and maintain our website</li>
            <li>Improve user experience</li>
            <li>Analyze usage patterns</li>
            <li>Detect and prevent technical issues</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mb-4 mt-6 dark:text-white">Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
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
