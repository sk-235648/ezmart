"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiSearch, FiMenu, FiUser, FiLogOut, FiX, FiHeart } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import SignInModal from '../modals/SignInModal';
import SignUpModal from '../modals/SignUpModal';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        // toast.success("Logged out successfully");
        alert("Logged out successfully");
        // Optionally, you can redirect to home page or login page
        router.push('/');
      }

      // toast.success("Logged out successfullyessfully.", { 
      //   position: "top-center",
      //   autoClose: 2000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      // });

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

  // Handle account click - redirect to login if not logged in
  const handleAccountClick = () => {
    setMobileMenuOpen(false);
    if (!isLoggedIn) {
      setShowSignInModal(true);
    } else {
      // If logged in, you can redirect to account page or show account options
      router.push('/account');
    }
  };

  // Handle wishlist click - show login message if not logged in
  const handleWishlistClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.info("Please log in to access your wishlist");
      setShowSignInModal(true);
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  };

  // Handle cart click - show login message if not logged in
  const handleCartClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.info("Please log in to access your cart");
      setShowSignInModal(true);
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
    <ToastContainer/>
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - logo and mobile menu button */}
            <div className="flex items-center flex-shrink-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none mr-2 transition-colors duration-200"
                aria-label="Open menu"
              >
                <FiMenu className="h-6 w-6" />
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
              className={`relative mx-2 md:mx-4 ${isLoggedIn ? 'flex-1 md:flex-1' : 'flex-1'} ${searchExpanded ? 'md:flex-1' : ''}`}
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
                    className={`${isLoggedIn ? 'w-40' : 'w-48'} pl-4 pr-2 focus:outline-none`}
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

            {/* Right side - auth, cart, wishlist */}
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
                  
                  {/* Mobile icons for logged in users */}
                  <div className="md:hidden flex items-center space-x-1">
                    {/* Wishlist Icon */}
                    <Link href="/wishlist" onClick={handleWishlistClick}>
                      <div className="relative p-1.5 rounded-md bg-gradient-to-br from-white to-purple-50 border border-purple-100 cursor-pointer hover:to-purple-100 transition-all duration-200">
                        <FiHeart className="h-5 w-5 text-red-500" />
                      </div>
                    </Link>

                    {/* Cart Icon */}
                    <Link href="/cart" onClick={handleCartClick}>
                      <div className="relative p-1.5 rounded-md bg-gradient-to-br from-white to-purple-50 border border-purple-100 cursor-pointer hover:to-purple-100 transition-all duration-200">
                        <FiShoppingCart className="h-5 w-5 text-purple-600" />
                      </div>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowSignInModal(true)}
                    className="hidden md:flex items-center space-x-1 px-3 py-2 rounded-md text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    <FiUser className="h-5 w-5" />
                    <span>Sign In</span>
                  </button>
                  {/* Sign In button hidden on mobile - will be in hamburger menu */}
                </>
              )}

              {/* Desktop Wishlist Icon - Hidden on mobile */}
              <Link href="/wishlist" onClick={handleWishlistClick} className="hidden md:block">
                <div className="relative p-2 rounded-md bg-gradient-to-br from-white to-purple-50 border border-purple-100 cursor-pointer hover:to-purple-100 transition-all duration-200">
                  <FiHeart className="h-6 w-6 text-red-500" />
                </div>
              </Link>

              {/* Desktop Cart Icon - Hidden on mobile */}
              <Link href="/cart" onClick={handleCartClick} className="hidden md:block">
                <div className="relative p-2 rounded-md bg-gradient-to-br from-white to-purple-50 border border-purple-100 cursor-pointer hover:to-purple-100 transition-all duration-200">
                  <FiShoppingCart className="h-6 w-6 text-purple-600" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <span className="font-bold text-purple-600 text-xl">EZMart</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors duration-200"
              aria-label="Close menu"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <Link href="/categories" onClick={() => setMobileMenuOpen(false)}>
                <div className="px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors duration-200">
                  Categories
                </div>
              </Link>
              <Link href="/deals" onClick={() => setMobileMenuOpen(false)}>
                <div className="px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors duration-200">
                  Deals
                </div>
              </Link>
              
              {/* Wishlist Link */}
              <Link href="/wishlist" onClick={handleWishlistClick} className="px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors duration-200 flex items-center justify-between">
                <div className="flex items-center">
                  <FiHeart className="mr-3 text-red-500" />
                  <span>Wishlist</span>
                </div>
              </Link>

              {/* Cart Link */}
              <Link href="/cart" onClick={handleCartClick} className="px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors duration-200 flex items-center justify-between">
                <div className="flex items-center">
                  <FiShoppingCart className="mr-3 text-purple-600" />
                  <span>Cart</span>
                </div>
              </Link>

              {/* Logout option - only show when logged in */}
              {isLoggedIn && (
                <div 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors duration-200 flex items-center"
                >
                  <FiLogOut className="mr-3 text-red-600" />
                  <span>Logout</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {!isLoggedIn && (
              <button
                onClick={() => {
                  setShowSignInModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors duration-200"
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