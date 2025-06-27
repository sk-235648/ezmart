// //items\[product]\page.js
// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import {
//   FiShoppingCart,
//   FiHeart,
//   FiShare2,
//   FiChevronLeft,
// } from "react-icons/fi";
// import Image from "next/image";

// export default function ProductDetail() {
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedVariant, setSelectedVariant] = useState({});
//   const [quantity, setQuantity] = useState(1);
//   const params = useParams();

//   useEffect(() => {
//     async function fetchProduct() {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/product/${params.product}`);
//         if (!res.ok) throw new Error("Failed to fetch product");
//         const data = await res.json();

//         if (!data) throw new Error("Product not found");

//         setProduct(data);
//         // Initialize with first variant if available
//         if (data.variants?.length > 0) {
//           setSelectedVariant(data.variants[0]);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (params.product) fetchProduct();
//   }, [params.product]);
//   const handleAddToCart = async () => {
//     try {
//       const response = await fetch("/api/cart", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           productId: params.product,
//           variantId: selectedVariant._id,
//           quantity,
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to add to cart");

//       alert("Product added to cart successfully!");
//     } catch (err) {
//       console.error("Error adding to cart:", err);
//       alert("Failed to add to cart");
//     }
//   };

//   if (loading)
//     return (
//       <div className="p-10 text-center text-gray-600">Loading product...</div>
//     );
//   if (error)
//     return <div className="p-10 text-center text-red-500">Error: {error}</div>;
//   if (!product)
//     return (
//       <div className="p-10 text-center text-gray-600">Product not found</div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white shadow-sm py-4 px-6">
//         <div className="max-w-7xl mx-auto">
//           <Link
//             href="/"
//             className="flex items-center text-purple-600 hover:text-purple-800"
//           >
//             <FiChevronLeft className="mr-1" /> Continue Shopping
//           </Link>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
//             {/* Product Images */}
//             <div className="space-y-4">
//               <div className="bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center">
//                 {selectedVariant.image || product.images?.[0] ? (
//                   <Image
//                     src={selectedVariant.image || product.images[0]}
//                     alt={product.title || "Product image"}
//                     width={600}
//                     height={600}
//                     className="w-full h-full object-contain"
//                     priority
//                   />
//                 ) : (
//                   <div className="text-gray-400">No image available</div>
//                 )}
//               </div>
//               <div className="flex space-x-2 overflow-x-auto py-2">
//                 {product.images?.map((img, i) => (
//                   <div key={i} className="flex-shrink-0">
//                     <Image
//                       src={img}
//                       width={80}
//                       height={80}
//                       className="w-16 h-16 rounded-md object-cover border-2 border-gray-200 hover:border-purple-500 cursor-pointer"
//                       alt={`Product thumbnail ${i}`}
//                       onClick={() =>
//                         setSelectedVariant((prev) => ({ ...prev, image: img }))
//                       }
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Product Details */}
//             <div className="space-y-6">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   {product.title || "Untitled Product"}
//                 </h1>
//                 <div className="flex items-center mt-2">
//                   <span className="text-2xl font-bold text-purple-600">
//                     ₹
//                     {selectedVariant.price
//                       ? selectedVariant.price.toLocaleString()
//                       : product.price?.toLocaleString() || "N/A"}
//                   </span>
//                   {selectedVariant.originalPrice && (
//                     <span className="text-gray-500 line-through ml-2 text-sm">
//                       ₹{selectedVariant.originalPrice.toLocaleString()}
//                     </span>
//                   )}
//                 </div>
//                 {product.rating && (
//                   <div className="flex items-center mt-1">
//                     <span className="text-yellow-500">★</span>
//                     <span className="text-gray-600 ml-1 text-sm">
//                       {product.rating} ({product.reviewCount || 0} reviews)
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-4">
//                 {product.description && (
//                   <p className="text-gray-700">{product.description}</p>
//                 )}

//                 {/* Product Variants */}
//                 {product.variants?.length > 0 && (
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-900">
//                       Options
//                     </h3>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {product.variants.map((variant) => (
//                         <button
//                           key={variant._id}
//                           onClick={() => setSelectedVariant(variant)}
//                           className={`px-3 py-1 border rounded-md text-sm ${
//                             selectedVariant._id === variant._id
//                               ? "bg-purple-600 text-white border-purple-600"
//                               : "bg-white text-gray-700 border-gray-300"
//                           }`}
//                         >
//                           {variant.name}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Quantity Selector */}
//                 <div className="flex items-center space-x-4">
//                   <h3 className="text-sm font-medium text-gray-900">
//                     Quantity
//                   </h3>
//                   <div className="flex items-center border rounded-md">
//                     <button
//                       onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                       className="px-3 py-1 text-lg hover:bg-gray-100"
//                       disabled={quantity <= 1}
//                     >
//                       -
//                     </button>
//                     <span className="px-3 py-1">{quantity}</span>
//                     <button
//                       onClick={() => setQuantity((q) => q + 1)}
//                       className="px-3 py-1 text-lg hover:bg-gray-100"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
//                 <button
//                   onClick={handleAddToCart}
//                   className="flex-1 flex items-center justify-center bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 transition-colors"
//                 >
//                   <FiShoppingCart className="mr-2" /> Add to Cart
//                 </button>
//                 <button
//                   onClick={() => {
//                     handleAddToCart();
//                     // Redirect to checkout
//                     window.location.href = "/checkout";
//                   }}
//                   className="flex-1 bg-slate-800 text-white py-3 px-6 rounded-md hover:bg-black transition-colors"
//                 >
//                   Buy Now
//                 </button>
//               </div>

//               <div className="flex space-x-4 pt-4">
//                 <button className="flex items-center text-gray-600 hover:text-purple-600">
//                   <FiHeart className="mr-2" /> Wishlist
//                 </button>
//                 <button className="flex items-center text-gray-600 hover:text-purple-600">
//                   <FiShare2 className="mr-2" /> Share
//                 </button>
//               </div>

//               {/* Additional Product Info */}
//               {product.additionalInfo && (
//                 <div className="pt-4 border-t border-gray-200">
//                   <h3 className="text-sm font-medium text-gray-900">
//                     Product Details
//                   </h3>
//                   <p className="text-gray-700 mt-2">{product.additionalInfo}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
