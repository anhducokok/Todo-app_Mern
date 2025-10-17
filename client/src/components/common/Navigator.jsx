import React, { useEffect, useState } from "react";
import Login from "../auth/Login";
import { useAuth } from "@/context/AuthContext";
import Register from "../auth/Register";

const Navigator = () => {
  const { user, isLoggedIn, logout, loading } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isRegisterPopup, setIsRegisterPopup] = useState(false);
  const handleOpenPopup = (type) => {
    if(type==="login"){
      setIsPopupOpen(true);
    } else{
      setIsRegisterPopup(true);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDropdown]);

  if (loading) {
    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-200 gap-4 mb-4">
        <div className="navigator p-4 flex justify-between space-x-4 w-3/4">
          <button className="btn">Home</button>
        </div>
        <div className="flex justify-center w-1/4">
          <div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 gap-4 mb-4">
      {isPopupOpen && (
        <Login isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} />
      )}
      {isRegisterPopup && (
        <Register isRegisterPopup={isRegisterPopup} setIsRegisterPopup={setIsRegisterPopup} />
      )}
      <div className="navigator flex justify-start space-x-4 w-3/4">
      <div className="w-1/4 cursor-pointer p-2 hover:bg-gray-100 rounded-md transition">
        <button className="btn">Home</button>
        </div>
        <div className="w-1/4 cursor-pointer p-2 hover:bg-gray-100 rounded-md transition">
          <button className="btn" ><a href="/Pomodoro">Pomodoro</a></button>
        </div>
      </div>

      {/* Authentication Section */}
      {!isLoggedIn  ? (
        // User is NOT logged in - Show Login button
        <div className="flex justify-center ">
        <div className="flex justify-center w-1/4 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition m-2">
          <button 
            className="btn cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2" 
            onClick={() => handleOpenPopup("login")}
          >
            Login
          </button>

        </div>
        <div className="flex justify-center w-3/4 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition m-2">
          <button className="btn cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2" 
            onClick={() => handleOpenPopup("register")}
          >
            Sign Up
          </button>
        </div>
        </div>
      ) : (
        // User IS logged in - Show user info and dropdown
        <div className="flex justify-end w-1/4 relative">
          <div 
            className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md transition" 
            onClick={(e) => {
              e.stopPropagation(); // Ngăn click lan ra ngoài
              handleDropdown();
            }}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=0ea5e9&color=fff`}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="ml-2 text-sm font-medium">{user?.username || 'User'}</span>
            <svg 
              className="w-4 h-4 ml-1 transition-transform duration-200" 
              style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-12 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                <div className="font-medium">{user?.username}</div>
                <div className="text-xs">{user?.email}</div>
              </div>
              
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                Profile
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                Settings
              </button>
              <div className="border-t border-gray-100">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navigator;
