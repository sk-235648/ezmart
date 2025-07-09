"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiChevronLeft, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        setLoading(true);
        const res = await fetch("/api/wishlist", { 
          cache: "no-store",
          credentials: "include" 
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          // Handle authentication error specifically
          if (data.message === "No token found") {
            setError("Please sign in to view your wishlist");
            setWishlist({ products: [] });
            return;
          }
          throw new Error(data.message || "Failed to fetch wishlist");
        }
        
        setWishlist(data.wishlist);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle authentication error specifically
        if (data.message === "No token found") {
          toast.error("Please sign in to manage your wishlist");
          return;
        }
        throw new Error(data.message || "Failed to remove from wishlist");
      }

      // Update local state to remove the product
      setWishlist(prev => ({
        ...prev,
        products: prev.products.filter(item => item.productId._id !== productId)
      }));

      toast.success("Product removed from wishlist");
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error(err.message || "Failed to remove from wishlist");
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          color: product.colors ? product.colors.split(',')[0].trim() : '',
          size: product.sizes ? product.sizes.split(',')[0].trim() : '',
        }),
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle authentication error specifically
        if (data.message === "No token found") {
          toast.error("Please sign in to add items to cart");
          return;
        }
        throw new Error(data.message || "Failed to add to cart");
      }

      toast.success("Item added to cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error(err.message || "Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            <FiChevronLeft className="mr-1" /> Continue Shopping
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Loading wishlist...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : wishlist.products.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">Your wishlist is empty</p>
            <Link href="/">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {wishlist.products.map((item) => (
                <div key={item.productId._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center">
                  <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
                    {item.productId.images?.[0] ? (
                      <img
                        src={item.productId.images[0]}
                        alt={item.productId.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-product.jpg";
                          e.target.onerror = null;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 sm:ml-6">
                    <Link href={`/product/${item.productId._id}`}>
                      <h3 className="text-lg font-medium text-gray-900 hover:text-purple-600">
                        {item.productId.title}
                      </h3>
                    </Link>
                    <p className="mt-1 text-lg font-medium text-purple-600">
                      ₹{item.productId.price?.toLocaleString() || "N/A"}
                    </p>
                  </div>

                  <div className="flex space-x-2 mt-4 sm:mt-0">
                    <button
                      onClick={() => handleAddToCart(item.productId)}
                      className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FiShoppingCart className="mr-2" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.productId._id)}
                      className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50"
                    >
                      <FiTrash2 className="mr-2" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}