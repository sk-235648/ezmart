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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openImage, setOpenImage] = useState(null);

  const handleBack = () => {
    setSelectedProduct(null);
    setOpenImage(null);
  };

  const handleImageOpen = (item) => {
    setOpenImage(item);
  };

  if (selectedProduct !== null) {
    // Show related products
    const related = Array.from({ length: 20 }, (_, i) => ({
      imageUrl: products[selectedProduct].imageUrl,
      title: `Related ${i + 1} - ${products[selectedProduct].title}`,
      price: `₹${Math.floor(Math.random() * 900 + 100)}`,
    }));

    return (
      <div className="p-6 ">
        <button
          onClick={handleBack}
          className="mb-6 px-4 py-2 bg-violet-600 text-white rounded-lg"
        >
          &lt;- Go Back
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {related.map((item, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl shadow-md cursor-pointer"
              onClick={() => handleImageOpen(item)}
            >
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.price}</p>
            </div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {openImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
              onClick={() => setOpenImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white rounded-2xl p-4 w-[90%] max-w-[500px] relative"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={openImage.imageUrl}
                  alt={openImage.title}
                  width={500}
                  height={400}
                  className="rounded-xl object-cover w-full h-[300px]"
                />
                <h3 className="text-lg font-bold mt-4">{openImage.title}</h3>
                <p className="text-gray-600 font-semibold mb-2">
                  {openImage.price}
                </p>
                <button
                  onClick={() => setOpenImage(null)}
                  className="absolute top-2 right-2 text-black font-bold"
                >
                  ✖
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

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
