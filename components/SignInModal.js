"use client"
import { FiX, FiUser } from 'react-icons/fi';

export default function SignInModal({ onClose, showSignUp }) {
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

          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
              <FiUser className="h-6 w-6 text-purple-600" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to your account</h3>
            
            <div className="mt-4 space-y-3">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <button className="w-full mt-4 py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Sign In
            </button>

            <p className="mt-3 text-sm text-gray-500">
              Don't have an account?{' '}
              <button 
                onClick={showSignUp}
                className="text-purple-600 hover:text-purple-500"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}