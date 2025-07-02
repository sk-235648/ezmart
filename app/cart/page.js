"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      setLoading(true);
      
      // Get stored userId if available
      const storedUserId = localStorage.getItem('userId');
      console.log("Fetching cart with storedUserId:", storedUserId);
      
      // Include userId in the request URL if available
      const url = storedUserId ? `/api/cart?userId=${storedUserId}` : "/api/cart";
      
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store"
      });
  
      const data = await res.json();
      console.log("🛒 Cart GET response:", data);
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to load cart");
      }
  
      // Update state from response
      setCart(data.cart || { items: [] });
      setUserId(data.userId || null);
      setIsAuthenticated(data.isAuthenticated !== false);
      
      // Store userId in localStorage if provided
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
        console.log("Stored userId from cart fetch:", data.userId);
      }
      
      // Log cart items for debugging
      if (data.cart && data.cart.items) {
        console.log("Cart items count:", data.cart.items.length);
        data.cart.items.forEach((item, index) => {
          console.log(`Cart item ${index}:`, {
            productId: item.productId,
            name: item.name,
            quantity: item.quantity
          });
        });
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
      toast.error(error.message || "Error loading cart");
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    
    // Listen for cart update events
    const handleCartUpdate = () => fetchCart();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    try {
      setUpdating(prev => ({ ...prev, [productId]: true }));

      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
        credentials: "include"
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      setCart(data.cart || { items: [] });
      toast.success("Quantity updated");
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error(error.message || "Error updating quantity");
      // Re-fetch cart to ensure sync with server
      fetchCart();
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating(prev => ({ ...prev, [productId]: true }));

      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
        credentials: "include"
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Removal failed");
      }

      setCart(data.cart || { items: [] });
      toast.success("Item removed from cart");
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Remove item error:", error);
      toast.error(error.message || "Error removing item");
      // Re-fetch cart to ensure sync with server
      fetchCart();
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to proceed to checkout");
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg">Loading your cart...</div>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Cart</h1>
          {!isAuthenticated && (
            <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded">
              Guest User - <button 
                onClick={() => router.push("/login?redirect=/cart")} 
                className="underline hover:text-orange-700"
              >
                Sign in to save your cart
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="hidden md:grid grid-cols-12 gap-4 border-b pb-4 mb-4 text-sm text-gray-500">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {cart.items.map((item) => {
              const itemName = item.name || "Unnamed Product";
              const itemPrice = item.price || 0;
              const itemQuantity = item.quantity || 1;
              const itemImage = item.image || "/placeholder-product.png";
              const itemTotal = (itemPrice * itemQuantity).toFixed(2);

              return (
                <div
                  key={item.productId || Math.random()}
                  className="grid grid-cols-12 gap-4 border-b py-4 items-center"
                >
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                      <Image
                        src={itemImage}
                        alt={itemName}
                        fill
                        className="object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/placeholder-product.png";
                        }}
                      />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-medium truncate">{itemName}</h3>
                      <div className="text-sm text-gray-500 space-y-1">
                        {item.color && <p>Color: {item.color}</p>}
                        {item.size && <p>Size: {item.size}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 text-center hidden md:block">
                    ₹{itemPrice.toFixed(2)}
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <select
                      value={itemQuantity}
                      onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                      className="w-full border rounded px-2 py-1 text-sm"
                      disabled={updating[item.productId]}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3 sm:col-span-2 text-right font-medium">
                    ₹{itemTotal}
                  </div>

                  <div className="col-span-12 flex justify-end mt-2">
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      disabled={updating[item.productId]}
                    >
                      {updating[item.productId] ? (
                        <>
                          <span className="inline-block h-3 w-3 border-t-2 border-red-600 rounded-full animate-spin"></span>
                          Removing...
                        </>
                      ) : (
                        "Remove"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between mt-6 font-medium border-t pt-4">
              <span className="text-gray-600">
                {cart.items.length} {cart.items.length === 1 ? "Item" : "Items"}
              </span>
              <span className="text-gray-900">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow h-fit sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>

              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full text-blue-600 hover:text-blue-800 py-2 text-sm flex items-center justify-center gap-1"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}