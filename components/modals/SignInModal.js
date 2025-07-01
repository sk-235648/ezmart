"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { FiX, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function SignInModal({ onClose, showSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Login successful
      onClose();
      router.refresh(); // Refresh to update auth state
      router.push("/"); // Redirect to dashboard
      
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    deleteCookie("user");
    window.dispatchEvent(new Event("userLoggedOut"));
    onClose();
    router.refresh?.();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
          <button onClick={onClose} className="absolute top-2 right-2 text-purple-500">
            <FiX className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <FiUser className="text-purple-600 h-6 w-6" />
            </div>
          </div>

          <h2 className="text-center text-lg font-semibold text-gray-800">Sign In</h2>

          {!isLoggedIn && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 outline-none"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 outline-none"
              />
              {error && (
                <div className="text-red-500 text-sm text-left">{error}</div>
              )}
              <button
                type="submit"
                className="w-full mt-4 py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-70"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          )}

          <p className="text-sm text-center mt-4 text-gray-500">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-purple-600 font-medium hover:underline">
                Logout
              </button>
            ) : (
              <>
                Don't have an account?{" "}
                <button onClick={showSignUp} className="text-purple-600 font-medium hover:underline">
                  Sign Up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}