"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 p-6 max-w-7xl w-full">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-full flex justify-center">
            <div className="w-64 h-80 bg-gray-100 rounded-2xl animate-pulse" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 px-6 w-full max-w-7xl">
        {products.map((product) => {
          const imageUrl = getImageUrl(product.images?.[0]);
          const title = product.title || product.category || 'Product';
          const price = product.price ? `$${product.price.toLocaleString()}` : '';

          return (
            <Link 
              key={product._id} 
              href={`/product/${product._id}`} 
              className="flex justify-center w-full"
              aria-label={`View ${title}`}
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-64 h-80 group"
              >
                {/* Card Container */}
                <div className="absolute inset-0 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-300 z-0" />
                
                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col border border-gray-100 rounded-2xl overflow-hidden m-2">
                  {/* Image Section */}
                  <div className="relative h-48 bg-gray-50 overflow-hidden">
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
                    {/* Quick View Badge */}
                    <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details
                    </div>
                  </div>
                  
                  {/* Text Section */}
                  <div className="p-4 flex flex-col items-center text-center flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
                      {title}
                    </h3>
                    <div className="mt-auto w-full">
                      {price && (
                        <p className="text-lg font-medium text-purple-600">
                          {price}
                        </p>
                      )}
                      {/* Rating (if available) */}
                      {product.rating && (
                        <div className="flex justify-center items-center mt-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>
                                {i < Math.floor(product.rating) ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                      )}
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