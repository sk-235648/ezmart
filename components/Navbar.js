"use client"

import Link from 'next/link';
import { FiShoppingCart, FiSearch, FiMenu, FiUser, FiX } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import SignUpModal from './SignUpModal';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);

  // Close expanded search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchExpanded && searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchExpanded(false);
      }
      if ((showSignInModal || showSignUpModal) && modalRef.current && !modalRef.current.contains(event.target)) {
        setShowSignInModal(false);
        setShowSignUpModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchExpanded, showSignInModal, showSignUpModal]);

  return (
    <>
      {/* Your Entire Original Navbar - 100% Preserved */}
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
                  <img src="./logo1.png" width={140} height={140} className='bg-purple-300' />
                </span>
              </Link>
            </div>

            {/* Middle - search bar */}
            <div
              ref={searchContainerRef}
              className={`relative flex-1 mx-2 md:mx-4 ${searchExpanded ? 'md:flex-1' : ''}`}
            >
              <div className="hidden md:block relative w-full">
                <input
                  type="text"
                  placeholder="Search for anything..."
                  className="w-full border border-gray-300 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 focus:outline-none">
                  Search
                </button>
              </div>

              <div className="md:hidden flex items-center border border-gray-300 rounded-md overflow-hidden h-10">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for anything..."
                  className="flex-1 pl-4 pr-2 focus:outline-none"
                  onFocus={() => {
                    setSearchExpanded(true);
                    setMobileMenuOpen(false);
                  }}
                />
                <button className="px-3 h-full border-l border-gray-300 text-gray-500 hover:bg-gray-100">
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Right side - cart and sign in */}
            <div className="flex items-center space-x-2 ml-2">
              <button
                onClick={() => setShowSignInModal(true)}
                className={`hidden md:flex items-center space-x-1 px-3 py-2 rounded-md text-purple-600 hover:bg-purple-50 ${searchExpanded ? 'md:flex' : 'md:flex'}`}
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
                <div className={`relative p-2 rounded-md bg-gradient-to-br from-white to-purple-50 border border-purple-100 cursor-pointer hover:to-purple-100 ${searchExpanded ? 'hidden md:block' : ''}`}>
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

      {/* Transparent Blur Modal */}
      {showSignInModal && (
        <>
          {/* Transparent Blur Layer - z-40 */}
          <div className="fixed inset-0 z-40 backdrop-blur-[2px] bg-white/10"></div>

          {/* Sign In Window - z-50 (above blur) */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              ref={modalRef}
              className="relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-sm mx-4 p-6"
            >
              {/* Close Button (top-right) */}
              {/* <button
                onClick={() => setShowSignInModal(false)}
                className="absolute -top-10 -right-2 p-2 text-white hover:text-gray-200"
              >
                <FiX className="h-6 w-6" />
              </button> */}

              {/* Sign In Content */}
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
                  <FiUser className="h-6 w-6 text-purple-600" />
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to your account</h3>

                <div className="mt-4 space-y-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <button className="w-full mt-4 py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Sign In
                </button>

                <p className="mt-3 text-sm text-gray-500">
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setShowSignInModal(false);
                      setShowSignUpModal(true);
                    }}
                    className="text-purple-600 hover:text-purple-500"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sign Up Modal */}
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