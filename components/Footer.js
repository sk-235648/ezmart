"use client"
import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-purple-600 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-purple-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-purple-600">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover:text-purple-600">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-600 hover:text-purple-600">
                  Today's Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-purple-600 tracking-wider uppercase">
              Customer Service
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-purple-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-purple-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-purple-600">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-purple-600">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-sm font-semibold text-purple-600 tracking-wider uppercase">
              About EZ Mart
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-purple-600">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-purple-600">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-purple-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-purple-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-purple-600 tracking-wider uppercase">
              Stay Updated
            </h3>
            <p className="mt-4 text-gray-600">
              Subscribe to our newsletter for the latest deals and updates
            </p>
            <form className="mt-4 flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-purple-600">
                <FiFacebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-600">
                <FiTwitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-600">
                <FiInstagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-600">
                <FiYoutube className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-600">
                <FiLinkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} EZ Mart. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <img 
              src="/payment-methods/visa.png" 
              alt="Visa" 
              className="h-6 object-contain"
            />
            <img 
              src="/payment-methods/mastercard.png" 
              alt="Mastercard" 
              className="h-6 object-contain"
            />
            <img 
              src="/payment-methods/paypal.png" 
              alt="PayPal" 
              className="h-6 object-contain"
            />
            <img 
              src="/payment-methods/apple-pay.png" 
              alt="Apple Pay" 
              className="h-6 object-contain"
            />
            <img 
              src="/payment-methods/apple-pay.png" 
              alt="Apple Pay" 
              className="h-6 object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}