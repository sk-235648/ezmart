// /components/Card.js

"use client";
import Image from "next/image";
import Link from "next/link"; // Importing Link from next
import { motion , AnimatePresence} from "framer-motion";


// Dummy product data
const products = [
  { id: 1, imageUrl: "/card1.jpg", title: "Custom Gold Name Necklace", price: "₹890" },
  { id: 2, imageUrl: "/card4.png", title: "Home decor", price: "₹899" },
  { id: 3, imageUrl: "/card6.jpg", title: "Gift for her", price: "₹9999" },
  { id: 4, imageUrl: "/card7.jpeg", title: "Beautiful Tops For Women.", price: "₹1299" },
  { id: 5, imageUrl: "/card8.jpg", title: "Men's Printed Evening Shirts", price: "₹1139" },
  { id: 6, imageUrl: "/card9.jpg", title: "Sport Chronograph Men's Watch", price: "₹50000" },
  { id: 7, imageUrl: "/card10.jpg", title: "High End Makeup Brands", price: "₹999" },
  { id: 8, imageUrl: "/card11.webp", title: "Graim Shoes Men Shoes", price: "₹1949" },
];

export default function CardList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 p-6">
      {products.map((product) => (
        <motion.div
          key={product.id}
          whileHover={{ scale: 1.03 }}
          className="relative w-[250px] h-[290px] group cursor-pointer"
        >
          <div className="absolute inset-0 bg-white rounded-3xl shadow-xl opacity-0 group-hover:opacity-100 transition duration-300 z-0"></div>
          <div className="relative z-10 p-2">
            <div className="relative w-full h-[180px] rounded-xl overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
              />
            </div>
            <div className="pt-3 px-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">{product.title}</h3>
              <p className="text-sm font-semibold text-gray-600 mt-1 mb-1">{product.price}</p>
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
