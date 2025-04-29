"use client";
import React, { useState,useRef } from "react";
import Link from "next/link";
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiChevronLeft,
} from "react-icons/fi";

// const products = [
//     {
//       id: 1,
//       imageUrl: "/imagecard/card1.jpg",
//       title: "Custom Gold Name Necklace",
//       price: "₹890",
//       originalPrice: "₹990",
//       discount: "10%",
//       description: "Beautiful custom-made gold plated name necklace. Perfect gift for loved ones. Made with high-quality materials and excellent craftsmanship.",
//       sizes: ["16 inches", "18 inches", "20 inches"],
//       colors: ["Gold", "Rose Gold", "Silver"],
//       deliveryDate: "Delivery by 3-5 business days",
//       reviews: 48,
//       rating: 4.8
//     },
//     {
//       id: 2,
//       imageUrl: "/imagecard/card4.png",
//       title: "Home decor",
//       price: "₹899",
//       originalPrice: "₹1058",
//       discount: "15%",
//       description: "Elegant home decor pieces to elevate your living space. Designed to bring warmth and style to your home.",
//       sizes: ["Small", "Medium", "Large"],
//       colors: ["Brown", "Beige", "White"],
//       deliveryDate: "Delivery by 4-6 business days",
//       reviews: 32,
//       rating: 4.5
//     },
//     {
//       id: 3,
//       imageUrl: "/imagecard/card6.jpg",
//       title: "Gift for her",
//       price: "₹9999",
//       originalPrice: "₹12499",
//       discount: "20%",
//       description: "Thoughtful gifts for the special woman in your life. Curated collections that she'll love and cherish.",
//       sizes: ["Standard"],
//       colors: ["Red", "Pink", "White"],
//       deliveryDate: "Delivery by 5-7 business days",
//       reviews: 58,
//       rating: 4.7
//     },
//     {
//       id: 4,
//       imageUrl: "/imagecard/card7.jpeg",
//       title: "Beautiful Tops For Women.",
//       price: "₹1299",
//       originalPrice: "₹1732",
//       discount: "25%",
//       description: "Trendy and stylish tops for modern women. Perfect for casual and semi-formal occasions.",
//       sizes: ["S", "M", "L", "XL"],
//       colors: ["Black", "Blue", "White"],
//       deliveryDate: "Delivery by 3-5 business days",
//       reviews: 41,
//       rating: 4.3
//     },
//     {
//       id: 5,
//       imageUrl: "/imagecard/card8.jpg",
//       title: "Men's Printed Evening Shirts",
//       price: "₹1139",
//       originalPrice: "₹1627",
//       discount: "30%",
//       description: "Fashionable printed shirts ideal for evening outings and parties. Made with premium fabrics for maximum comfort.",
//       sizes: ["M", "L", "XL", "XXL"],
//       colors: ["Navy Blue", "Maroon", "White"],
//       deliveryDate: "Delivery by 2-4 business days",
//       reviews: 36,
//       rating: 4.6
//     },
//     {
//       id: 6,
//       imageUrl: "/imagecard/card9.jpg",
//       title: "Sport Chronograph Men's Watch",
//       price: "₹50000",
//       originalPrice: "₹76923",
//       discount: "35%",
//       description: "High-performance sport chronograph watches with stylish design and reliable functionality.",
//       sizes: ["42mm", "44mm"],
//       colors: ["Black", "Silver", "Gold"],
//       deliveryDate: "Delivery by 5-7 business days",
//       reviews: 19,
//       rating: 4.9
//     },
//     {
//       id: 7,
//       imageUrl: "/imagecard/card10.jpg",
//       title: "High End Makeup Brands",
//       price: "₹999",
//       originalPrice: "₹1052",
//       discount: "5%",
//       description: "Top quality makeup products from high-end brands. Long-lasting and skin-friendly formulas.",
//       sizes: ["Standard"],
//       colors: ["Assorted"],
//       deliveryDate: "Delivery by 3-5 business days",
//       reviews: 50,
//       rating: 4.2
//     },
//     {
//       id: 8,
//       imageUrl: "/imagecard/card11.webp",
//       title: "Graim Shoes Men Shoes",
//       price: "₹1949",
//       originalPrice: "₹2214",
//       discount: "12%",
//       description: "Durable and stylish shoes for men. Designed for both casual and semi-formal wear.",
//       sizes: ["7", "8", "9", "10", "11"],
//       colors: ["Black", "Brown", "Grey"],
//       deliveryDate: "Delivery by 3-6 business days",
//       reviews: 27,
//       rating: 4.4
//     }
//   ];
  
const product = {
  id: 1,
  imageUrl: "/imagecard/card1.jpg",
  title: "Custom Gold Name Necklace",
  price: 890,
  originalPrice: 990,
  discount: "10%",
  description:
    "Beautiful custom-made gold plated name necklace. Perfect gift for loved ones. Made with high-quality materials and excellent craftsmanship.",
  sizes: ["16 inches", "18 inches", "20 inches"],
  colors: ["Gold", "Rose Gold", "Silver"],
  deliveryDate: "Delivery by 3-5 business days",
  reviews: 48,
  rating: 4.8,
};

export default function ProductDetail() {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const carouselRef = useRef(null);

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      product: product.title,
      size: selectedSize,
      color: selectedColor,
      quantity,
      price: product.price,
    });
    // Add your cart logic here
  };

  const handleBuyNow = () => {
    console.log("Buying now:", {
      product: product.title,
      size: selectedSize,
      color: selectedColor,
      quantity,
      price: product.price,
    });
    // Add your checkout logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation/Back button */}
      <div className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            <FiChevronLeft className="mr-1" />
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-md w-16 h-16 cursor-pointer border-2 border-transparent hover:border-purple-500"
                  ></div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.title}
                </h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-purple-600">
                    ₹{product.price}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2 py-0.5 rounded">
                    {product.discount} OFF
                  </span>
                </div>

                <p className="text-gray-700">{product.description}</p>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">Colors</h3>
                  <div className="flex space-x-2 mt-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color
                            ? "border-purple-500"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        aria-label={color}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <div className="flex space-x-2 mt-2">
                    {product.sizes.map((size) => (
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

                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1 text-lg hover:bg-gray-100"
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
                  <span className="text-sm text-gray-500">
                    {product.deliveryDate}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 transition-colors"
                >
                  <FiShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-slate-800 text-white py-3 px-6 rounded-md hover:bg-black transition-colors"
                >
                  Buy Now
                </button>
              </div>

              <div className="flex space-x-4 pt-4">
                <button className="flex items-center text-gray-600 hover:text-purple-600">
                  <FiHeart className="mr-2" />
                  Wishlist
                </button>
                <button className="flex items-center text-gray-600 hover:text-purple-600">
                  <FiShare2 className="mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description and Details */}
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Product Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Specifications</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <span className="font-medium">Material:</span> Gold Plated
                </li>
                <li>
                  <span className="font-medium">Chain Type:</span> Cable Chain
                </li>
                <li>
                  <span className="font-medium">Pendant Size:</span>{" "}
                  Customizable
                </li>
                <li>
                  <span className="font-medium">Closure:</span> Lobster Claw
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* You may also like section */}
        <div className="mt-8 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              You May Also Like
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  carouselRef.current?.scrollBy({
                    left: -300,
                    behavior: "smooth",
                  })
                }
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  carouselRef.current?.scrollBy({
                    left: 300,
                    behavior: "smooth",
                  })
                }
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex space-x-4 overflow-x-auto scroll-smooth pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: "none" }} // Hide scrollbar in Firefox
          >
            {/* Hide scrollbar in Chrome/Safari */}
            <style jsx>{`
              .overflow-x-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Sample related products - in a real app you would map through actual data */}
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-56 bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="bg-gray-100 h-40 flex items-center justify-center">
                  <span className="text-gray-400">Product Image {i + 1}</span>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900">
                    Similar Product {i + 1}
                  </h3>
                  <p className="text-purple-600 mt-1">
                    ₹{Math.floor(Math.random() * 1000) + 500}
                  </p>
                  <button className="mt-2 text-sm text-purple-600 hover:text-purple-800">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
