 
import Link from 'next/link';

export default function Frontpg() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 max-w-7xl mx-auto">
      {/* Large promo tile */}
      <div className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden min-h-[400px] flex items-end bg-cover bg-center hover:scale-105 transition-all duration-500" 
           style={{ backgroundImage: "url('/images/Shoe.jpg')" }}>
        <div className="p-6 w-full text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-shadow">Step into summer</h2>
          <Link href="/shop" className="inline-block px-6 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-lg">
            Shop now
          </Link>
        </div>
      </div>

      {/* Medium promo tile 1 */}
      <div className="md:col-span-2 relative rounded-xl overflow-hidden min-h-[200px] flex items-end bg-cover bg-center hover:scale-105 transition-all duration-500" 
           style={{ backgroundImage: "url('/images/Shirt.jpg')" }}>
        <div className="p-5 w-full text-white">
          <h3 className="text-xl font-bold mb-1 text-shadow">Wear it today</h3>
          <Link href="/delivery" className="inline-block px-5 py-2.5 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-md">
            Shop now
          </Link>
        </div>
      </div>

      {/* Medium promo tile 2 */}
      <div className="md:col-span-2 relative rounded-xl overflow-hidden min-h-[200px] flex items-end bg-cover bg-center hover:scale-105 transition-all duration-500" 
           style={{ backgroundImage: "url('/images/earbud.jpg')" }}>
        <div className="p-5 w-full text-white">
          <h3 className="text-xl font-bold mb-3 text-shadow">Beach-ready tees*</h3>
          <Link href="/easter" className="inline-block px-5 py-2.5 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-md">
            Shop the list
          </Link>
        </div>
      </div>

      {/* Small promo tile 1 */}
      <div className="relative rounded-xl overflow-hidden min-h-[200px] flex items-end bg-cover bg-center hover:scale-105 transition-all duration-500" 
           style={{ backgroundImage: "url('/images/Tshirt1.jpg')" }}>
        <div className="p-5 w-full text-white">
          <h3 className="text-lg font-bold mb-3 text-shadow">Walk in style</h3>
          <Link href="/dining" className="inline-block px-4 py-2 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow">
            Shop dining
          </Link>
        </div>
      </div>

      {/* Small promo tile 2 */}
      <div className="relative rounded-xl overflow-hidden min-h-[200px] flex items-end bg-cover bg-center hover:scale-105 transition-all duration-500" 
           style={{ backgroundImage: "url('/images/Tshirt.jpg')" }}>
        <div className="p-5 w-full text-white">
          <h3 className="text-lg font-bold mb-3 text-shadow">Deals that pop</h3>
          <Link href="/shoes" className="inline-block px-4 py-2 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow">
            Shop now
          </Link>
        </div>
      </div>

      {/* Text-only promo tile */}
      <div className="relative rounded-xl overflow-hidden min-h-[200px] flex items-center justify-center bg-gray-300 hover:scale-105 transition-all duration-500 bg-cover bg-center " style={{ backgroundImage: "url('/images/Del.jpg')" }}>
        <div className="p-5 w-full text-center">
          <h3 className="text-xl font-bold text-white">Fast Delivery</h3>
        </div>
      </div>

      {/* Sale promo tile */}
      <div className="relative rounded-xl overflow-hidden min-h-[200px] flex flex-col items-center justify-center bg-gradient-to-tr from-white to-purple-500 hover:scale-105 transition-all duration-500">
        <div className="p-5 w-full text-center text-white">
          <h3 className="text-xl font-bold mb-1 text-shadow">Serve up a pop of</h3>
          <p className="text-lg font-semibold mb-3 text-shadow">Up to 65% off</p>
          <Link href="/sale" className="inline-block px-5 py-2.5 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-md">
            Shop sale
          </Link>
        </div>
      </div>
    </div>
  );
}