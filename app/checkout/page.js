"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";

export default function CheckoutPage() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart", {
        credentials: "include"
      });
      
      const data = await res.json();

      if (!res.ok) {
        // Handle authentication error specifically
        if (data.message === "No token found") {
          toast.error("Please sign in to access checkout");
          setCart({ items: [] });
          return;
        }
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

  const calculateTotal = () => {
    return cart.items.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      const total = calculateTotal();
      
      if (total <= 0) {
        toast.error("Cannot process payment for empty cart");
        return;
      }

      // Create order on server
      const orderResponse = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
        }),
      });

      const orderData = await orderResponse.json();
      
      if (!orderResponse.ok) {
        // Handle authentication error specifically
        if (orderData.message === "No token found") {
          toast.error("Please sign in to complete your purchase");
          return;
        }
        throw new Error(orderData.message || "Failed to create order");
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total * 100, // in paise
        currency: "INR",
        name: "EzMart",
        description: "Purchase from EzMart",
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Verify payment on server
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: total,
              }),
            });

            const verifyData = await verifyResponse.json();
            
            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || "Payment verification failed");
            }

            toast.success("Payment successful!");
            // Clear cart and redirect to success page
            // This would typically be handled by your backend
            setTimeout(() => {
              router.push("/payment-success");
            }, 2000);
          } catch (error) {
            toast.error(error.message || "Payment verification failed");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#6366F1",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
      });
    } catch (error) {
      toast.error(error.message || "Payment initialization failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading checkout...</div>
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
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-sm py-4 px-6 mb-8">
            <div className="max-w-7xl mx-auto">
              <Link
                href="/cart"
                className="flex items-center text-purple-600 hover:text-purple-800"
              >
                <FiChevronLeft className="mr-1" /> Back to Cart
              </Link>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-8">Checkout</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Order Summary */}
            <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="border-b pb-4 mb-4">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex justify-between py-2">
                    <div className="flex">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow h-fit">
              <h2 className="text-xl font-bold mb-4">Payment</h2>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="text-gray-600 mb-2">Secure payment powered by Razorpay</p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded transition-colors ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {processing ? 'Processing...' : 'Pay Now'}
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="w-full text-purple-600 hover:underline py-2"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}