// /components/Card.js

"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const products = [
  { id: 1, imageUrl: "/imagecard/card1.jpg", title: "Custom Gold Name Necklace",  rating: 4.5 },
  { id: 2, imageUrl: "/imagecard/card4.png", title: "Home decor",  rating: 4.0 },
  { id: 3, imageUrl: "/imagecard/card6.jpg", title: "Gift for her",  rating: 4.7 },
  { id: 4, imageUrl: "/imagecard/card7.jpeg", title: "Beautiful Tops For Women.",  rating: 4.2 },
  { id: 5, imageUrl: "/imagecard/card8.jpg", title: "Men's Printed Evening Shirts", rating: 4.1 },
  { id: 6, imageUrl: "/imagecard/card9.jpg", title: "Sport Chronograph Men's Watch",  rating: 4.8 },
  { id: 7, imageUrl: "/imagecard/card10.jpg", title: "High End Makeup Brands",  rating: 4.3 },
  { id: 8, imageUrl: "/imagecard/card11.webp", title: "Graim Shoes Men Shoes", rating: 4.4 },
];

export default function CardList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`} className="w-full">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="relative w-[250px] h-[240px] group cursor-pointer mx-auto"
          >
            <div className="absolute inset-0 bg-white rounded-3xl shadow-xl opacity-0 group-hover:opacity-100 transition duration-300 z-0" />
            <div className="relative z-10 p-2">
              <div className="relative w-full h-[180px] rounded-xl overflow-hidden mx-auto">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
                />
              </div>
              <div className="pt-3 px-1 text-center">
                <h3 className="text-sm font-semibold text-gray-900">{product.title}</h3>
                 
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
