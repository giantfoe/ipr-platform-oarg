"use client";

import Link from 'next/link';
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-6 mb-4 md:mb-0">
          <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
        <div className="flex space-x-6">
          <a href="https://twitter.com/oarg_sl" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaTwitter className="h-5 w-5" />
          </a>
          <a href="https://facebook.com/oarg_sl" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaFacebook className="h-5 w-5" />
          </a>
          <a href="https://linkedin.com/company/oarg_sl" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaLinkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
      <div className="mt-4 text-center text-gray-500">
        &copy; {new Date().getFullYear()} OARG. All rights reserved.
      </div>
    </footer>
  );
} 