// /components/Card.js

"use client";
import Image from "next/image";
import Link from "next/link"; // Importing Link from next
import { motion , AnimatePresence} from "framer-motion";
import { useState } from "react";


// Dummy product data
const products = [
  { imageUrl: "/card1.jpg", title: "Custom Gold Name Necklace", price: "₹890" },

  { imageUrl: "/card4.png", title: "Home decor", price: "₹899" },

  { imageUrl: "/card6.jpg", title: "Gift for her", price: "₹9999" },
  {
    imageUrl: "/card7.jpeg",
    title: "Beautiful Tops For Women.",
    price: "₹1299",
  },
  {
    imageUrl: "/card8.jpg",
    title: "Men's Printed Evening Shirts",
    price: "₹1139",
  },
  {
    imageUrl: "/card9.jpg",
    title: "Sport Chronograph Men's Watch",
    price: "₹50000",
  },
  { imageUrl: "/card10.jpg", title: "High End Makeup Brands ", price: "₹999" },
  { imageUrl: "/card11.webp", title: "Graim Shoes Men Shoes", price: "₹1949" },
];

export default function CardList() {
   


  // Main cards
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl-mx-auto gap-4 p-4 min-h-screen  ml-20 ">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          whileHover={{ scale: 1.03 }}
          className="relative w-[250px] h-[265px] group cursor-pointer"
          onClick={() => setSelectedProduct(index)}
        >
          <div className="absolute inset-0 bg-white rounded-3xl shadow-xl opacity-0 group-hover:opacity-100 transition duration-300 z-0 "></div>
          <div className="relative z-10 p-2 ">
            <div className="relative w-full h-[180px] rounded-xl overflow-hidden mx-auto">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
              />
            </div>
            <div className="pt-3 px-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {product.title}
              </h3>
              <p className="text-sm font-semibold text-gray-600 mt-1 mb-1">
                {product.price}
              </p>
            </div>
          </div>
          {/* Wrap the card with Link for redirection */}
          <Link href={`/product/${product.id}`} passHref>
            <div className="absolute inset-0 bg-transparent"></div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
