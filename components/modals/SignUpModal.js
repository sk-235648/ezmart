"use client";
import { useState } from "react";
import { FiEye, FiEyeOff, FiX, FiUser } from "react-icons/fi";

export default function SignUpModal({ onClose, showSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    passwordMatch: false,
    passwordLength: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Validate passwords on change
      const match = updated.password !== updated.confirmPassword;
      const tooShort = updated.password.length > 0 && updated.password.length < 8;
      setErrors({
        passwordMatch: match,
        passwordLength: tooShort,
      });

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.passwordMatch || errors.passwordLength) return;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful. You can now sign in.");
        showSignIn(); // switch modal
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 backdrop-blur-[2px] bg-white/10"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-sm p-6">
          <button
            onClick={onClose}
            className="absolute cursor-pointer -top-10 -right-2 p-2 text-purple-500 hover:text-purple-600"
          >
            <FiX className="h-6 w-6 hover:scale-110 transition-all duration-200" />
          </button>

          <form onSubmit={handleSubmit}>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
                <FiUser className="h-6 w-6 text-purple-600" />
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Create Account
              </h3>

              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.passwordLength && (
                    <p className="mt-1 text-xs text-red-500">
                      Password must be at least 8 characters
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.passwordMatch && (
                    <p className="mt-1 text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={errors.passwordMatch || errors.passwordLength}
                  className={`w-full py-2 px-4 rounded-md text-white ${
                    errors.passwordMatch || errors.passwordLength
                      ? "bg-purple-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  Sign Up
                </button>

                <p className="mt-3 text-sm text-gray-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={showSignIn}
                    className="text-purple-600 hover:text-purple-500"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
