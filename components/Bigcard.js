// components/ Bigcard.js
"use client"
// components/ Bigcard.js
import React, { useState, useEffect } from 'react';

const  Bigcard = () => {
  const [currentCard, setCurrentCard] = useState(0);
  
  const cards = [
    {
      title: "Save with refurbished appliances",
      description: "Put top brands in your price range with quality refurbished.",
      buttonText: "Shop refurbished",
      categories: ["Laptops", "Smartphones", "Audio"],
    },
    {
      title: "Premium certified refurbished",
      description: "Like-new products with warranty at 30-50% off.",
      buttonText: "Browse deals",
      categories: ["Tablets", "Monitors", "Accessories"],
    },
    {
      title: "Premium certified refurbished",
      description: "Like-new products with warranty at 30-50% off.",
      buttonText: "Browse deals",
      categories: ["Tablets", "Monitors", "Accessories"],
    }
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % cards.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [cards.length]);

  return (
    <div className="max-w-[80vw] mx-auto my-12 px-4">
      <div className={`relative h-96 rounded-xl overflow-hidden 
                      bg-gradient-to-br from-blue-100  to-purple-500`}>
        
        {/* Cards container with sliding animation */}
        <div className="flex h-full transition-transform duration-500 ease-in-out"
             style={{ transform: `translateX(-${currentCard * 100}%)` }}>
          
          {cards.map((card, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full flex">
              {/* Text content */}
              <div className="w-1/2 p-10 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {card.title}
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  {card.description}
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg w-fit transition-colors">
                  {card.buttonText}
                </button>
                <div className="flex space-x-6 mt-8">
                  {card.categories.map((category, i) => (
                    <span key={i} className="text-gray-500 font-medium">{category}</span>
                  ))}
                </div>
              </div>

              {/* Image area - replace these divs with your actual images */}
              <div className="w-1/2 relative">
                <div className="absolute top-8 right-10 w-32 h-32 bg-white/80 rounded-lg shadow-sm">
                <img src="./images/earbud.jpg" alt="" /></div>
                <div className="absolute top-1/2 right-20 w-40 h-40 bg-white/90 rounded-lg shadow-md -translate-y-1/2"><img src="./images/earbud.jpg" alt="" /></div>
                <div className="absolute bottom-8 right-10 w-32 h-32 bg-white/80 rounded-lg shadow-sm"><img src="./images/earbud.jpg" alt="" /></div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicator dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {cards.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentCard(index)}
              className={`w-3 h-3 rounded-full ${index === currentCard ? 'bg-blue-600' : 'bg-gray-300'}`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default  Bigcard;