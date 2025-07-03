//product/[id]/page.js
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiChevronLeft,
} from "react-icons/fi";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/product/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        if (!data) throw new Error("Product not found");

        setProduct(data);
        // Initialize with first available size and color if they exist
        if (data.sizes) {
          const sizesArray = data.sizes.split(",");
          setSelectedSize(sizesArray[0].trim());
        }
        if (data.colors) {
          const colorsArray = data.colors.split(",");
          setSelectedColor(colorsArray[0].trim());
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) fetchProduct();
  }, [params.id]);

 const handleAddToCart = async (redirectToCheckout = false) => {
  try {
    setIsAddingToCart(true);
    
    // Validate selections
    if (product.sizes && !selectedSize) {
      toast.warning("Please Select a size");
      return;
    }
    if (product.colors && !selectedColor) {
      toast.warning("Please Select a color");
      return;
    }

    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: params.id,
        size: selectedSize,
        color: selectedColor,
        quantity,
        price: product.price,
        name: product.title, // Changed from 'name' to 'title' to match your product model
        image: product.images?.[0] || null
      }),
      credentials: "include" // Important for cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add to cart");
    }

    toast.success("Product added to cart!");
    
    if (redirectToCheckout) {
      router.push("/checkout");
    }
  } catch (err) {
    console.error("Error adding to cart:", err);
    toast.error(err.message || "Failed to add to cart");
  } finally {
    setIsAddingToCart(false);
  }
};

  const handleBuyNow = () => {
    handleAddToCart(true);
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-600">Loading product...</div>
    );
  if (error)
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;
  if (!product)
    return (
      <div className="p-10 text-center text-gray-600">Product not found</div>
    );

  // Helper to parse comma-separated strings into arrays
  const parseAttributes = (str) => {
    return str ? str.split(",").map((item) => item.trim()) : [];
  };

  const sizes = parseAttributes(product.sizes);
  const colors = parseAttributes(product.colors);

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title || "Product image"}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = "/placeholder-product.jpg";
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="text-gray-400">No image available</div>
                )}
              </div>
              <div className="flex space-x-2 overflow-x-auto py-2">
                {product.images?.map((img, i) => (
                  <div key={i} className="flex-shrink-0">
                    <img
                      src={img}
                      width={64}
                      height={64}
                      className="rounded-md object-cover border-2 border-gray-200 hover:border-purple-500 cursor-pointer"
                      alt={`Product thumbnail ${i}`}
                      onError={(e) => {
                        e.target.src = "/placeholder-thumbnail.jpg";
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.title || "Untitled Product"}
                </h1>
                <div className="flex items-center mt-2">
                  <span className="text-2xl font-bold text-purple-600">
                    ₹{product.price?.toLocaleString() || "N/A"}
                  </span>
                  
                </div>
              </div>

              <div className="space-y-4">
                {product.description && (
                  <p className="text-gray-700">{product.description}</p>
                )}

                {/* Sizes */}
                {sizes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1 border rounded-md text-sm ${
                            selectedSize === size
                              ? "bg-purple-600 text-white border-purple-600"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {colors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Color</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            selectedColor === color
                              ? "border-purple-500"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                          aria-label={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center space-x-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    Quantity
                  </h3>
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1 text-lg hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-1 text-lg hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={isAddingToCart}
                  className={`flex-1 flex items-center justify-center bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 transition-colors ${
                    isAddingToCart ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isAddingToCart ? (
                    "Adding..."
                  ) : (
                    <>
                      <FiShoppingCart className="mr-2" /> Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isAddingToCart}
                  className={`flex-1 bg-slate-800 text-white py-3 px-6 rounded-md hover:bg-black transition-colors ${
                    isAddingToCart ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  Buy Now
                </button>
              </div>

              <div className="flex space-x-4 pt-4">
                <button className="flex items-center text-gray-600 hover:text-purple-600">
                  <FiHeart className="mr-2" /> Wishlist
                </button>
                <button className="flex items-center text-gray-600 hover:text-purple-600">
                  <FiShare2 className="mr-2" /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}