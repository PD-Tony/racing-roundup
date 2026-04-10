import React from 'react';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { darkMode } = useTheme();
  
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">Racing Roundup</h2>
            <p className="text-gray-400">© {currentYear} Racing Roundup. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/category/f1" className="text-gray-300 hover:text-white transition-colors">
                    Formula 1
                  </Link>
                </li>
                <li>
                  <Link href="/category/motogp" className="text-gray-300 hover:text-white transition-colors">
                    MotoGP
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Information</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>Racing Roundup is not affiliated with Formula 1, MotoGP, or any racing teams. All trademarks are property of their respective owners.</p>
          <p className="mt-2">
            <Link href="/accessibility" className="hover:text-white transition-colors">
              Accessibility Statement
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
