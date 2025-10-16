import React from 'react'
import { useState } from "react";
import { useAuth } from '@/context/AuthContext';

const Login = ({ isPopupOpen, setIsPopupOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await login(email, password);
      setIsPopupOpen(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };
  const onClose = () => {
    setIsPopupOpen(false);
  }
  return (
    <div>
      {/* a pop up login form blur background */}
      <div 
        className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
       
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <div className="flex justify-between items-center mb-6 cursor-pointer">
            <h2 className="text-2xl font-bold text-center flex-1">Login</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="on"
                required
                disabled={isLoading}
                
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
                autoComplete="on"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>
            {/* Button to navigate to registration form */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setIsPopupOpen(true);
                    setIsLogin(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Sign Up
                </button>
              </p>
            </div>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login