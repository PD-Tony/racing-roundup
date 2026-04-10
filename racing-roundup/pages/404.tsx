import React from 'react';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { useTheme } from '../context/ThemeContext';

export default function Custom404() {
  const { darkMode } = useTheme();
  return (
    <Layout 
      title="Page Not Found - Racing Roundup"
      description="The page you are looking for does not exist."
    >
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex space-x-4">
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
            Return to Home
          </Link>
          <Link href="/category/f1" className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
            F1 News
          </Link>
          <Link href="/category/motogp" className="bg-blue-800 hover:bg-blue-900 text-white font-medium py-2 px-6 rounded-md transition-colors">
            MotoGP News
          </Link>
        </div>
      </div>
    </Layout>
  );
}
