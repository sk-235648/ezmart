"use client"
 
import Link from 'next/link';
import { FiShoppingCart, FiSearch, FiMenu } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close expanded search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchExpanded && 
          searchContainerRef.current && 
          !searchContainerRef.current.contains(event.target)){
        setSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchExpanded]);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - logo and mobile menu button */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none mr-2"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <Link href="/">
              <span className="text-xl font-bold text-purple-600 cursor-pointer">
                 <img src="./logo1.png" width={140} height={140} className='bg-purple-300'/>
              </span>
            </Link>
          </div>

          {/* Middle - search bar */}
          <div 
            ref={searchContainerRef}
            className={`relative flex-1 mx-2 md:mx-4 ${searchExpanded ? 'md:flex-1' : ''}`}
          >
            <div className="relative w-full">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for anything..."
                className="w-full border border-gray-300 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                onFocus={() => {
                  setSearchExpanded(true);
                  setMobileMenuOpen(false);
                }}
                onBlur={() => {
                  if (window.innerWidth >= 768) {
                    setSearchExpanded(false);
                  }
                }}
              />
              <button className="absolute right-0 top-0 h-full px-3 text-gray-500 md:hidden">
                <FiSearch className="h-5 w-5" />
              </button>
              <button className="absolute right-0 top-0 h-full px-4 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 focus:outline-none hidden md:block">
                Search
              </button>
            </div>
          </div>

          {/* Right side - cart and mobile search toggle */}
          <div className="flex items-center ml-2">
            {/* Mobile search toggle button - only shown when search is collapsed */}
            {!searchExpanded && (
              <button 
                className="md:hidden text-gray-500 hover:text-gray-900 mr-3 focus:outline-none"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchExpanded(true);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
              >
                <FiSearch className="h-6 w-6" />
              </button>
            )}

            {/* Cart - hidden when search is expanded on mobile */}
            <Link href="/cart">
              <div className={`relative p-2 rounded-md bg-gradient-to-br from-white to-purple-50 border border-purple-100 cursor-pointer hover:to-purple-100 transition-colors ${searchExpanded ? 'hidden md:block' : ''}`}>
                <FiShoppingCart className="h-6 w-6 text-purple-600" />
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-2 pb-4 border-t border-gray-200">
            <div className="space-y-1">
              <Link href="/categories">
                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer">
                  Categories
                </span>
              </Link>
              <Link href="/deals">
                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer">
                  Deals
                </span>
              </Link>
              <Link href="/account">
                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer">
                  Account
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
 