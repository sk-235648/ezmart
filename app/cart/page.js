'use client';
import React from 'react';
import Image from 'next/image';

const Cart = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">My Cart</h1>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto gap-8">
        {/* Left Section - 70% */}
        <div className="w-full lg:w-[70%] bg-white p-6 rounded-lg shadow">
          <div className="border-t-2 border-b-2 border-gray-300 py-6">
            {/* Headings */}
            <div className="flex justify-end pr-4 text-sm font-semibold text-gray-500 mb-4">
              <div className="w-[100px] text-center">Each</div>
              <div className="w-[120px] text-center">Quantity</div>
              <div className="w-[100px] text-center">Total</div>
            </div>

            {/* Cart Row */}
            <div className="flex justify-between items-start">
              {/* Product Info */}
              <div className="flex gap-6 w-[60%]">
                <Image
                  src="/images/Tshirt.jpg"
                  width={150}
                  height={180}
                  alt="Product"
                  className="object-cover h-[180px] w-[150px] rounded mt-1"
                />
                <div className="flex flex-col justify-start gap-1">
                  <h2 className="text-lg font-bold">Plaid Shirt & Skirt Set</h2>
                  <p className="text-sm text-gray-600">Color: OLIVE/MULTI</p>
                  <p className="text-sm text-gray-600">Size: S</p>
                  <p className="text-sm text-green-600 font-medium">In Stock</p>
                </div>
              </div>

              {/* Price Info */}
              <div className="flex gap-4 items-center justify-end w-[40%] pr-4">
                <div className="w-[100px] text-center font-semibold">$39.99</div>
                <div className="w-[120px] text-center">
                  <select className="border border-gray-300 px-3 py-1 rounded">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div className="w-[100px] text-center font-semibold">$39.99</div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex gap-6 mt-6 text-sm text-blue-600 ml-[156px]">
              <button className="hover:underline">Edit</button>
              <button className="hover:underline text-red-600">Remove</button>
              <button className="hover:underline text-gray-600">Save for Later</button>
            </div>
          </div>

          {/* Subtotal */}
          <div className="flex justify-between mt-6 px-2 font-medium text-gray-800">
            <span>1 Item</span>
            <span>$39.99</span>
          </div>
        </div>

        {/* Right Section - 30% */}
        <div className="w-full lg:w-[30%] bg-white p-6 rounded-lg shadow space-y-6">
          {/* Promo Code */}
          <div>
            <label htmlFor="promo" className="text-sm font-semibold">Enter Promo Code</label>
            <div className="flex mt-2">
              <input
                type="text"
                id="promo"
                className="border border-gray-300 px-3 py-2 rounded-l-md w-full"
                placeholder="Promo Code"
              />
              <button className="bg-black text-white px-4 rounded-r-md">Submit</button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Shipping cost</span>
              <span>TBD</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-$0</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>TBD</span>
            </div>
            <hr />
            <div className="flex justify-between text-base font-semibold">
              <span>Estimated Total</span>
              <span>$39.99</span>
            </div>
            <p className="text-green-700 text-xs">
              or 4 interest-free payments of $10.00 with Afterpay
            </p>
            <p className="text-red-600 text-xs font-medium">
              You’re $10.01 away from free shipping!
            </p>
          </div>

          {/* Checkout */}
          <button className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 rounded">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
