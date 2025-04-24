// /pages/product/[id].js

"use client";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

// Static data for demo

const products = [
  { id: 1, imageUrl: "/card1.jpg", title: "Custom Gold Name Necklace", price: "₹890", description: "Beautiful custom necklace", rating: 4.5 },
  { id: 2, imageUrl: "/card4.png", title: "Home decor", price: "₹899", description: "Stylish home decor item", rating: 4.0 },
  { id: 3, imageUrl: "/card6.jpg", title: "Gift for her", price: "₹9999", description: "A perfect gift for her", rating: 4.7 },
  { id: 4, imageUrl: "/card7.jpeg", title: "Beautiful Tops For Women.", price: "₹1299", description: "Elegant women's tops", rating: 4.3 },
  { id: 5, imageUrl: "/card8.jpg", title: "Men's Printed Evening Shirts", price: "₹1139", description: "Trendy evening shirts for men", rating: 4.2 },
  { id: 6, imageUrl: "/card9.jpg", title: "Sport Chronograph Men's Watch", price: "₹50000", description: "Luxury chronograph watch", rating: 4.8 },
  { id: 7, imageUrl: "/card10.jpg", title: "High End Makeup Brands", price: "₹999", description: "Premium makeup items", rating: 4.6 },
  { id: 8, imageUrl: "/card11.webp", title: "Graim Shoes Men Shoes", price: "₹1949", description: "Comfortable and stylish men's shoes", rating: 4.4 },
];

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  // Find the product by ID
  const product = products.find((p) => p.id == id);

  if (!product) {
    return <div>Product not found!</div>;
  }

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-xl shadow-xl mb-6">
        <div className="flex">
          <div className="relative w-[300px] h-[300px] rounded-xl overflow-hidden">
            <Image src={product.imageUrl} alt={product.title} width={300} height={300} className="object-cover" />
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold">{product.title}</h2>
            <p className="text-xl text-gray-700 mt-2">{product.price}</p>
            <p className="text-sm text-gray-600 mt-2">{product.description}</p>
            <p className="text-sm text-gray-500 mt-2">Rating: {product.rating} ⭐</p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">More Products</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.slice(0, 5).map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg p-4">
            <div className="relative w-[250px] h-[250px] rounded-xl overflow-hidden">
              <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
            </div>
            <h4 className="text-sm font-medium mt-3">{product.title}</h4>
            <p className="text-sm text-gray-600">{product.price}</p>
          </div>
        ))}
      </div>

      {/* Button to load more products */}
      <button
        onClick={() => {}}
        className="mt-6 p-3 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-700 transition duration-200"
      >
        Load More
      </button>
    </div>
  );
}
