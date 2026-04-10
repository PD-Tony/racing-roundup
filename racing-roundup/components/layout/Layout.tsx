import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navigation from './Navigation';
import Footer from './Footer';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Racing Roundup - F1 and MotoGP News',
  description = 'The latest Formula 1 and MotoGP news, all in one place' 
}) => {
  const { darkMode } = useTheme();
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark:bg-gray-900' : 'bg-gray-100'} transition-colors duration-200`}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8 dark:text-gray-100">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
