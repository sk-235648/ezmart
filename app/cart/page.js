// app/cart/page.js
'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
  try {
    setLoading(true);

    const response = await fetch("/api/cart");
    let data;

    try {
      data = await response.json(); // may throw if no body
    } catch (err) {
      console.error("❌ Failed to parse cart response JSON:", err);
      toast.error("Something went wrong (invalid server response)");
      return;
    }

    if (response.ok && data.success) {
      const items = data.cart?.items || data.items || [];
      setCartItems(items);
    } else {
      toast.error(data?.message || "Failed to fetch cart items");
    }
  } catch (error) {
    console.error("❌ Network error:", error);
    toast.error("Network error fetching cart items");
  } finally {
    setLoading(false);
  }
};


  const updateQuantity = async (productId, newQuantity) => {
    try {
      setUpdatingItems(prev => ({ ...prev, [productId]: true }));
      
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      const data = await response.json();
      if (response.ok) {
        // Handle both response formats
        const updatedItems = data.cart?.items || data.items || [];
        setCartItems(updatedItems);
        toast.success(data.message || 'Cart updated successfully');
      } else {
        toast.error(data.message || 'Failed to update cart');
      }
    } catch (error) {
      toast.error('Network error updating cart');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdatingItems(prev => ({ ...prev, [productId]: true }));
      
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      if (response.ok) {
        // Handle both response formats
        const updatedItems = data.cart?.items || data.items || [];
        setCartItems(updatedItems);
        toast.success(data.message || 'Item removed from cart');
      } else {
        toast.error(data.message || 'Failed to remove item');
      }
    } catch (error) {
      toast.error('Network error removing item');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Handle both populated and unpopulated product data
      const price = item.productId?.price || item.price;
      return total + (price || 0) * (item.quantity || 1);
    }, 0);
  };

  const getProductImage = (item) => {
    // Handle both populated and unpopulated product data
    return item.productId?.images?.[0] || item.images?.[0] || '/images/placeholder.jpg';
  };

  const getProductTitle = (item) => {
    return item.productId?.title || item.title || 'Product';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-10 flex justify-center items-center">
        <div className="text-center">Loading your cart...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">
            Looks like you haven&apos;t added any items yet.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="lg:w-2/3 bg-white p-4 md:p-6 rounded-lg shadow">
            <div className="hidden md:grid grid-cols-12 gap-4 border-b pb-4 mb-4">
              <div className="col-span-5 font-medium text-gray-500">Product</div>
              <div className="col-span-2 font-medium text-gray-500 text-center">
                Price
              </div>
              <div className="col-span-3 font-medium text-gray-500 text-center">
                Quantity
              </div>
              <div className="col-span-2 font-medium text-gray-500 text-right">
                Total
              </div>
            </div>

            {cartItems.map((item) => (
              <div
                key={item._id || item.productId}
                className="grid grid-cols-12 gap-4 border-b py-4 items-center"
              >
                <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={getProductImage(item)}
                      alt={getProductTitle(item)}
                      fill
                      className="object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{getProductTitle(item)}</h3>
                    {item.color && (
                      <p className="text-sm text-gray-500">Color: {item.color}</p>
                    )}
                    {item.size && (
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-2 text-center hidden md:block">
                  ${(item.productId?.price || item.price).toFixed(2)}
                </div>

                <div className="col-span-4 md:col-span-3 flex justify-center">
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId || item._id, parseInt(e.target.value))
                    }
                    className="border rounded px-2 py-1"
                    disabled={updatingItems[item.productId || item._id]}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 text-right font-medium">
                  ${((item.productId?.price || item.price) * item.quantity).toFixed(2)}
                </div>

                <div className="col-span-12 md:col-span-12 flex justify-end mt-2">
                  <button
                    onClick={() => removeItem(item.productId || item._id)}
                    className="text-red-600 text-sm hover:underline"
                    disabled={updatingItems[item.productId || item._id]}
                  >
                    {updatingItems[item.productId || item._id] ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-6 font-medium">
              <span>{cartItems.length} Item{cartItems.length !== 1 ? 's' : ''}</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 bg-white p-4 md:p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span>$0.00</span>
              </div>

              <hr className="my-2" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors"
              >
                Proceed to Checkout
              </button>

              <div className="text-center text-sm text-gray-500 mt-4">
                <p>or</p>
                <button
                  onClick={() => router.push('/')}
                  className="text-blue-600 hover:underline mt-2"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;