import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DarkModeToggle from '../common/DarkModeToggle';
import { useTheme } from '../../context/ThemeContext';

const Navigation: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode } = useTheme();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Formula 1', path: '/category/f1' },
    { name: 'MotoGP', path: '/category/motogp' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-md dark:shadow-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">Racing Roundup</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`hover:text-gray-200 transition-colors ${
                  router.pathname === item.path ? 'font-semibold border-b-2 border-white' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
            <DarkModeToggle />
          </nav>

          {/* Mobile Menu Button and Dark Mode Toggle for Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggle />
            <button
              type="button"
              className="text-white hover:text-gray-200"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`hover:text-gray-200 transition-colors ${
                    router.pathname === item.path ? 'font-semibold' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
