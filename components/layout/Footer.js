"use client"
import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="bg-purple-600 border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">

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
                                    Today&apos;s Deals
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

                    {/* About Us & Social Links */}
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
                        
                        {/* Social Media Links */}
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
                                Follow Us
                            </h4>
                            <div className="flex space-x-4">
                                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                    <FiFacebook className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                    <FiTwitter className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                    <FiInstagram className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                    <FiYoutube className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                                    <FiLinkedin className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-200 py-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-white text-sm">
                        &copy; {new Date().getFullYear()} EZ Mart. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
