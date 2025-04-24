"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Changed to use the App Router
import { FiShoppingCart, FiSearch, FiMenu, FiUser } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import SignUpModal from './SignUpModal';
import SignInModal from './SignInModal';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close expanded search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchExpanded && searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchExpanded]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchExpanded(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - logo and mobile menu button */}
            <div className="flex items-center flex-shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none mr-2"
              >
                <FiMenu className="h-5 w-5 " />
              </button>
              <Link href="/">
                <span className="font-bold text-purple-600 cursor-pointer">
                  {/* Logo for large screens */}
                  <span className="hidden lg:block">
                    <img src="./logo1.png" width={140} height={140} className="bg-purple-300" />
                  </span>
                  {/* "EZ" text for small and medium screens */}
                  <span className="block lg:hidden text-xl">EZ</span>
                </span>
              </Link>
            </div>

            {/* Middle - search bar */}
            <div
              ref={searchContainerRef}
              className={`relative flex-1 mx-2 md:mx-4 ${searchExpanded ? 'md:flex-1' : ''}`}
            >
              <form onSubmit={handleSearch}>
                <div className="hidden md:block relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for anything..."
                    className="w-full border border-gray-300 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                  />
                  <button 
                    type="submit"
                    className="absolute right-0 top-0 h-full px-4 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 focus:outline-none"
                  >
                    Search
                  </button>
                </div>

                <div className="md:hidden flex items-center border border-gray-300 rounded-md overflow-hidden h-10">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for anything..."
                    className="flex-1 pl-4 pr-2 focus:outline-none"
                    onFocus={() => {
                      setSearchExpanded(true);
                      setMobileMenuOpen(false);
                    }}
                  />
                  <button 
                    type="submit"
                    className="px-3 h-full border-l border-gray-300 text-gray-500 hover:bg-gray-100"
                  >
                    <FiSearch className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right side - cart and sign in */}
            <div className="flex items-center space-x-2 ml-2">
              <button
                onClick={() => setShowSignInModal(true)}
                className={`hidden md:flex items-center space-x-1 px-3 py-2 rounded-md text-purple-600 hover:bg-purple-50`}
              >
                <FiUser className="h-5 w-5" />
                <span>Sign In</span>
              </button>

              {!searchExpanded && (
                <button
                  onClick={() => setShowSignInModal(true)}
                  className="md:hidden p-2 text-purple-600 hover:bg-purple-50 rounded-full"
                >
                  <FiUser className="h-5 w-5" />
                </button>
              )}

              <Link href="/cart">
                <div className={`relative p-2 rounded-md bg-gradient-to-br from-white to-purple-50 border border-purple-100 cursor-pointer hover:to-purple-100`}>
                  <FiShoppingCart className="h-6 w-6 text-purple-600" />
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </div>
              </Link>
            </div>
          </div>

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
                <button
                  onClick={() => {
                    setShowSignInModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-purple-600 hover:bg-purple-50 cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modals */}
      {showSignInModal && (
        <SignInModal
          onClose={() => setShowSignInModal(false)}
          showSignUp={() => {
            setShowSignInModal(false);
            setShowSignUpModal(true);
          }}
        />
      )}

      {showSignUpModal && (
        <SignUpModal
          onClose={() => setShowSignUpModal(false)}
          showSignIn={() => {
            setShowSignUpModal(false);
            setShowSignInModal(true);
          }}
        />
      )}
    </>
  );
}