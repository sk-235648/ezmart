"use client";
import React, { useState, useEffect } from "react";
const Bigcard = () => {
  const [currentCard, setCurrentCard] = useState(0);

  const cards = [
    {
      title: "Shop the Grand deals ",
      description: "Top brands with exiting offers !!!",
      buttonText: "Shop  Now",
      categories: ["Laptops", "Smartphones", "Audio"],
      images: [
        "/images/Shirt.jpg",
        "/images/Shoe.jpg",
        "/images/Tshirt.jpg"
      ]
    },
    {
      title: "Premium certified refurbished",
      description: "Like-new products with warranty at 30-50% off.",
      buttonText: "Browse deals",
      categories: ["Tablets", "Monitors", "Accessories"],
      images: [
        "/images/earbud.jpg",
        "/images/watch.jpg",
        "/images/accessories.jpg"
      ]
    }
  ];
 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [cards.length]);

  return (
    <div className="max-w-[80vw] mx-auto my-12 px-4">
      <div className="relative h-auto md:h-96 rounded-xl overflow-hidden">
        {/* Cards container with sliding animation */}
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentCard * 100}%)` }}
        >
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-full h-full flex flex-col md:flex-row bg-gradient-to-br from-blue-100 to-purple-500"
            >
              {/* Text content */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                  {card.title}
                </h2>
                <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg">
                  {card.description}
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg w-fit transition-colors text-sm md:text-base">
                  {card.buttonText}
                </button>
                <div className="flex flex-wrap gap-2 md:gap-6 mt-4 md:mt-8">
                  {card.categories.map((category, i) => (
                    <span key={i} className="text-gray-500 font-medium text-sm md:text-base">
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image area - responsive positioning */}
              <div className="w-full md:w-1/2 relative h-48 md:h-auto">
                {/* Mobile layout - smaller images in a row */}
                <div className="md:hidden flex justify-center items-center h-full gap-4 px-4">
                  {card.images.map((img, i) => (
                    <div 
                      key={i}
                      className="w-24 h-24 rounded-lg shadow-sm bg-cover bg-center"
                      style={{ backgroundImage: `url(${img})` }}
                    ></div>
                  ))}
                </div>

                {/* Desktop layout - original positioning */}
                <div className="hidden md:block w-full h-full">
                  <div 
                    className="absolute top-8 right-10 w-32 h-32 rounded-lg shadow-sm bg-cover bg-center"
                    style={{ backgroundImage: `url(${card.images[0]})` }}
                  ></div>
                  <div 
                    className="absolute top-1/2 right-20 w-40 h-40 rounded-lg shadow-md -translate-y-1/2 bg-cover bg-center"
                    style={{ backgroundImage: `url(${card.images[1]})` }}
                  ></div>
                  <div 
                    className="absolute bottom-8 right-10 w-32 h-32 rounded-lg shadow-sm bg-cover bg-center"
                    style={{ backgroundImage: `url(${card.images[2]})` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicator dots */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCard(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentCard ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bigcard;