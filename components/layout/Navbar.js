"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiSearch, FiMenu, FiUser, FiLogOut, FiX } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import SignInModal from '../modals/SignInModal';
import SignUpModal from '../modals/SignUpModal';
import { toast } from 'react-toastify';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Check auth status on component mount and when modals close
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/status', { cache: 'no-store' });
        const data = await res.json();
        setIsLoggedIn(data.isAuthenticated);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
      }
    };
    
    checkAuth();
  }, [showSignInModal, showSignUpModal]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (res.ok) {
        setIsLoggedIn(false);
        setMobileMenuOpen(false);
        toast.success("Logged out successfully");
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error("Logout failed");
    }
  };

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
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - logo and mobile menu button */}
            <div className="flex items-center flex-shrink-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none mr-2"
                aria-label="Open menu"
              >
                <FiMenu className="h-5 w-5" />
              </button>
              <Link href="/">
                <span className="font-bold text-purple-600 cursor-pointer">
                  <span className="hidden lg:block">
                    <img src="./logo1.png" width={140} height={140} alt="EZMart Logo" />
                  </span>
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
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for anything..."
                    className="flex-1 pl-4 pr-2 focus:outline-none"
                    onFocus={() => setSearchExpanded(true)}
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

            {/* Right side - auth and cart */}
            <div className="flex items-center space-x-2 ml-2">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex items-center space-x-1 px-3 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    <FiLogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="md:hidden p-2 text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                  >
                    <FiLogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowSignInModal(true)}
                    className="hidden md:flex items-center space-x-1 px-3 py-2 rounded-md text-purple-600 hover:bg-purple-50"
                  >
                    <FiUser className="h-5 w-5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => setShowSignInModal(true)}
                    className="md:hidden p-2 text-purple-600 hover:bg-purple-50 rounded-full"
                  >
                    <FiUser className="h-5 w-5" />
                  </button>
                </>
              )}

              <Link href="/cart">
                <div className="relative p-2 rounded-md bg-gradient-to-br from-white to-purple-50 border border-purple-100 cursor-pointer hover:to-purple-100">
                  <FiShoppingCart className="h-6 w-6 text-purple-600" />
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <span className="font-bold text-purple-600 text-xl">EZMart</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-900"
              aria-label="Close menu"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <Link href="/categories" onClick={() => setMobileMenuOpen(false)}>
                <div className="px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors">
                  Categories
                </div>
              </Link>
              <Link href="/deals" onClick={() => setMobileMenuOpen(false)}>
                <div className="px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors">
                  Deals
                </div>
              </Link>
              <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                <div className="px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors">
                  My Account
                </div>
              </Link>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <FiLogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowSignInModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <FiUser className="h-5 w-5 mr-2" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSignInModal && (
        <SignInModal
          onClose={() => {
            setShowSignInModal(false);
            setIsLoggedIn(true);
          }}
          showSignUp={() => {
            setShowSignInModal(false);
            setShowSignUpModal(true);
          }}
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setShowSignInModal(false);
          }}
        />
      )}

      {showSignUpModal && (
        <SignUpModal
          onClose={() => {
            setShowSignUpModal(false);
            setIsLoggedIn(true);
          }}
          showSignIn={() => {
            setShowSignUpModal(false);
            setShowSignInModal(true);
          }}
          onSignupSuccess={() => {
            setIsLoggedIn(true);
            setShowSignUpModal(false);
          }}
        />
      )}
    </>
  );
}