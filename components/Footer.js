<<<<<<< HEAD
"use client"
import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="bg-purple-600 border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                            Quick Links
                        </h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="/" className="text-gray-300 hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-white">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="text-gray-300 hover:text-white">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link href="/deals" className="text-gray-300 hover:text-white">
                                    Today's Deals
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                            Customer Service
                        </h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="/contact" className="text-gray-300 hover:text-white">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-300 hover:text-white">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-gray-300 hover:text-white">
                                    Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-gray-300 hover:text-white">
                                    Returns & Refunds
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* About Us */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                            About EZ Mart
                        </h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-white">
                                    Our Story
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-gray-300 hover:text-white">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-300 hover:text-white">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-300 hover:text-white">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col items-start">
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                            Stay Updated
                        </h3>
                        <p className="mt-4 text-gray-300">
                            Subscribe to our newsletter for the latest deals and updates
                        </p>
                    </div>
                    <div>
                        <form className="mt-4 flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-slate-800 text-white rounded-r-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                            >
                                Subscribe
                            </button>
                        </form>
                        <div className="mt-4 flex space-x-4">
                            <Link href="#" className="hover:text-white">
                                <FiFacebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-white">
                                <FiTwitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-white">
                                <FiInstagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-white">
                                <FiYoutube className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-white">
                                <FiLinkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-200 py-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-white text-sm">
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
                    </div>
                </div>
            </div>
        </footer>
    );
}
=======
import React from 'react'

const Footer = () => {
  return (
    <div>
      <h1>This is footer</h1>
    </div>
  )
}

export default Footer
>>>>>>> main
