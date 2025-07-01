"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiShoppingCart, FiMenu, FiSearch } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { getCookie } from "cookies-next";
import SignInModal from "../modals/SignInModal";
import SignUpModal from "../modals/SignUpModal";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Load user from cookie
  const loadUserFromCookie = () => {
    try {
      const cookieValue = getCookie("user");
      if (cookieValue) {
        const parsed = typeof cookieValue === "string" ? JSON.parse(cookieValue) : cookieValue;
        setUser(parsed);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error parsing user cookie:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserFromCookie();
    window.addEventListener("userLoggedIn", loadUserFromCookie);
    window.addEventListener("userLoggedOut", loadUserFromCookie);
    return () => {
      window.removeEventListener("userLoggedIn", loadUserFromCookie);
      window.removeEventListener("userLoggedOut", loadUserFromCookie);
    };
  }, []);

  // Collapse search if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchExpanded && searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchExpanded]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchExpanded(false);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo & Menu */}
            <div className="flex items-center flex-shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none mr-2"
              >
                <FiMenu className="h-5 w-5" />
              </button>
              <Link href="/" className="font-bold text-purple-600 cursor-pointer">
                <span className="hidden lg:block">
                  <img src="/logo1.png" alt="Logo" width={140} height={140} />
                </span>
                <span className="block lg:hidden text-xl">EZ</span>
              </Link>
            </div>

            {/* Middle: Search Bar */}
            <div
              ref={searchContainerRef}
              className={`relative flex-1 mx-2 md:mx-4 ${searchExpanded ? "md:flex-1" : ""}`}
            >
              <form onSubmit={handleSearch}>
                {/* Desktop Search */}
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
                    className="absolute right-0 top-0 h-full px-4 bg-purple-600 text-white rounded-r-md hover:bg-purple-700"
                  >
                    Search
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden flex items-center border border-gray-300 rounded-md overflow-hidden h-10">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 pl-4 pr-2 focus:outline-none"
                    onFocus={() => {
                      setSearchExpanded(true);
                      setMobileMenuOpen(false);
                    }}
                  />
                  <button type="submit" className="px-3 h-full border-l border-gray-300 text-gray-500 hover:bg-gray-100">
                    <FiSearch className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right: SignIn/Avatar & Cart */}
            <div className="flex items-center space-x-3">
              {user ? (
                <div
                  onClick={() => router.push("/account")}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 cursor-pointer"
                >
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <button
                  onClick={() => setShowSignInModal(true)}
                  className="text-purple-600 px-3 py-2 border rounded-md flex items-center hover:bg-purple-50"
                >
                  <FiUser className="mr-1" /> Sign In
                </button>
              )}

              <Link href="/cart">
                <div className="relative p-2 bg-purple-50 border rounded-md hover:bg-purple-100">
                  <FiShoppingCart className="h-6 w-6 text-purple-600" />
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                    0
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-2 pb-4 border-t border-gray-200">
              <div className="space-y-1">
                <Link href="/categories">
                  <span className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Categories</span>
                </Link>
                <Link href="/deals">
                  <span className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Deals</span>
                </Link>
                <Link href="/account">
                  <span className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Account</span>
                </Link>
                {!user && (
                  <button
                    onClick={() => {
                      setShowSignInModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-md"
                  >
                    Sign In
                  </button>
                )}
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
