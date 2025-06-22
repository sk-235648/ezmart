"use client";

import Image from "next/image";
import { Heart, HeartOff } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {use} from "react"
import Link from "next/link";

// Dummy products
const products = [
  { id: 1, imageUrl: "/imagecard/card1.jpg", title: "Custom Gold Name Necklace", price: "₹890", discount: "10%" },
  { id: 2, imageUrl: "/imagecard/card4.png", title: "Home decor", price: "₹899", discount: "15%" },
  { id: 3, imageUrl: "/imagecard/card6.jpg", title: "Gift for her", price: "₹9999", discount: "20%" },
  { id: 4, imageUrl: "/imagecard/card7.jpeg", title: "Beautiful Tops For Women.", price: "₹1299", discount: "25%" },
  { id: 5, imageUrl: "/imagecard/card8.jpg", title: "Men's Printed Evening Shirts", price: "₹1139", discount: "30%" },
  { id: 6, imageUrl: "/imagecard/card9.jpg", title: "Sport Chronograph Men's Watch", price: "₹50000", discount: "35%" },
  { id: 7, imageUrl: "/imagecard/card10.jpg", title: "High End Makeup Brands", price: "₹999", discount: "5%" },
  { id: 8, imageUrl: "/imagecard/card11.webp", title: "Graim Shoes Men Shoes", price: "₹1949", discount: "12%" },
];

export default function ProductPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const productId = parseInt(id);

  // related products (except the clicked one)
  const relatedProducts = products.filter((p) => p.id !== productId);

  return (
    <div className="p-8">
      {/* Only Related Products */}
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <RelatedCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Ek chhota se card component
function RelatedCard({ product }) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer"
    >
      <Link href={`/items/${product.title}`}>
        <div className="relative w-full h-[200px]">
          <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
          {/* Like button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setLiked(!liked);
            }}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md z-10"
          >
            {liked ? <HeartOff className="text-red-500 w-5 h-5" /> : <Heart className="text-gray-600 w-5 h-5" />}
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 truncate">{product.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-bold">{product.price}</p>
            <span className="text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded-full">
              {product.discount} OFF
            </span>
          </div>

          {/* Dummy Star Rating */}
          <div className="text-yellow-400 text-sm mt-1">⭐⭐⭐⭐☆</div>
        </div>
      </Link>
    </motion.div>
  );
}
