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
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const handleCartUpdate = (e) => {
      if (e.detail?.cart) {
        setCart(e.detail.cart);
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart", {
        credentials: "include"
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load cart");
      }

      setCart({
        items: data.cart?.items || []
      });
    } catch (error) {
      toast.error(error.message || "Error loading cart");
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    try {
      setUpdating((prev) => ({ ...prev, [productId]: true }));

      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
        credentials: "include"
      });

      const data = await res.json();
      if (res.ok) {
        setCart(data.cart || { items: [] });
        toast.success("Quantity updated");
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.message || "Error updating quantity");
    } finally {
      setUpdating((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating((prev) => ({ ...prev, [productId]: true }));

      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
        credentials: "include"
      });

      const data = await res.json();
      if (res.ok) {
        setCart(data.cart || { items: [] });
        toast.success("Item removed");
      } else {
        throw new Error(data.message || "Removal failed");
      }
    } catch (error) {
      toast.error(error.message || "Error removing item");
    } finally {
      setUpdating((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your cart...</div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow">
            <div className="hidden md:grid grid-cols-12 gap-4 border-b pb-4 mb-4">
              <div className="col-span-6 font-medium">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {cart.items.map((item) => {
              const itemName = item.name || "Unnamed Product";
              const itemPrice = item.price || 0;
              const itemQuantity = item.quantity || 1;
              const itemImage = item.image || "/placeholder-product.png";

              return (
                <div
                  key={item.productId || Math.random()}
                  className="grid grid-cols-12 gap-4 border-b py-4 items-center"
                >
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <img
                        src={itemImage}
                        alt={itemName}
                        fill
                        className="object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/placeholder-product.png";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{itemName}</h3>
                      {item.color && (
                        <p className="text-sm text-gray-500">
                          Color: {item.color}
                        </p>
                      )}
                      {item.size && (
                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 text-center hidden md:block">
                    ${itemPrice.toFixed(2)}
                  </div>

                  <div className="col-span-2">
                    <select
                      value={itemQuantity}
                      onChange={(e) =>
                        updateQuantity(item.productId, parseInt(e.target.value))
                      }
                      className="w-full border rounded px-2 py-1"
                      disabled={updating[item.productId]}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 text-right font-medium">
                    ${(itemPrice * itemQuantity).toFixed(2)}
                  </div>

                  <div className="col-span-12 flex justify-end mt-2">
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:underline text-sm"
                      disabled={updating[item.productId]}
                    >
                      {updating[item.productId] ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between mt-6 font-medium">
              <span>
                {cart.items.length} {cart.items.length === 1 ? "Item" : "Items"}
              </span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full text-blue-600 hover:underline py-2"
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