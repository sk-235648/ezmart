"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiStar, FiHeart, FiShoppingCart } from "react-icons/fi";

export default function CardList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/product');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return '/placeholder-product.jpg';
    if (url.includes('res.cloudinary.com')) return url;
    return url.startsWith('/') ? url : `/${url}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FiStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FiStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
      } else {
        stars.push(<FiStar key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 p-4 sm:p-6 max-w-7xl w-full">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-full">
            <div className="w-full h-80 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );

  if (!products.length) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
      <div className="text-gray-500 text-lg mb-4">No products found</div>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
      >
        Refresh
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full py-8">
      {/* Optional Header */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our curated collection of premium items
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 px-4 sm:px-6 w-full max-w-7xl">
        {products.map((product) => {
          const imageUrl = getImageUrl(product.images?.[0]);
          const title = product.title || product.category || 'Product';
          const price = product.price ? `₹${product.price.toLocaleString()}` : '';
          const originalPrice = product.originalPrice ? `₹${product.originalPrice.toLocaleString()}` : '';
          const discount = product.originalPrice && product.price ? 
            Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
          const rating = product.rating || 0;
          const reviewCount = product.reviewCount || 0;

          return (
            <Link 
              key={product._id} 
              href={`/product/${product._id}`} 
              className="w-full"
              aria-label={`View ${title}`}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full h-80 group"
              >
                {/* Card Container */}
                <div className="absolute inset-0 bg-white rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-300 z-0" />
                
                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col border border-gray-100 rounded-2xl overflow-hidden m-2">
                  {/* Image Section */}
                  <div className="relative h-40 bg-gray-50 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                        e.target.onerror = null;
                      }}
                    />
                    
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{discount}%
                      </div>
                    )}
                    
                    {/* Wishlist Button */}
                    <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <FiHeart className="w-4 h-4" />
                    </button>
                    
                    {/* Quick View Badge */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white/95 px-3 py-1.5 rounded-full text-xs font-medium text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      View Details
                    </div>
                  </div>
                  
                  {/* Text Section */}
                  <div className="p-3 flex flex-col flex-grow">
                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1.5 leading-tight">
                      {title}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {renderStars(rating)}
                        <span className="text-sm text-gray-600 ml-1.5 font-medium">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                      {reviewCount > 0 && (
                        <span className="text-xs text-gray-500 ml-1.5">
                          ({reviewCount})
                        </span>
                      )}
                    </div>
                    
                    {/* Price Section */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {originalPrice && discount > 0 ? (
                            <>
                              <span className="text-lg font-bold text-purple-600">
                                {price}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {originalPrice}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-purple-600">
                              {price}
                            </span>
                          )}
                        </div>
                        
                        {/* Add to Cart Button */}
                        <button className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors opacity-0 group-hover:opacity-100">
                          <FiShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}