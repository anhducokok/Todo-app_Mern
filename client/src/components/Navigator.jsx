import React from "react";

const Navigator = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const handleLogin = () => {
    // Logic for login (e.g., show login modal, redirect to login page, etc.)
    if (!isLogin) {
      setIsLogin(true);
      return;
    }
    setIsLogin(false);
  };
  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 gap-4 mb-4">
      <div className="navigator p-4 flex justify-between space-x-4 w-3/4">
        <button className="btn">Home</button>
        
      </div>
      {/* User is logged in */}
      {isLogin ? (
        <div className="flex justify-end w-1/4">
          <button className="btn" onClick={() => setIsLogin(false)}>
            Logout
          </button>
        </div>
      ) : (
        <div className="flex justify-end w-1/4" onClick={handleDropdown}>
          {/* User avatar and name */}
          <div className="flex items-center cursor-pointer" >
            <img
              src="/path/to/user/avatar.jpg"
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="ml-2">User Name</span>
          </div>

          {/* Dropdown list with user options */}
          {showDropdown && (
          <div className="absolute right-80 mt-7 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Profile
            </button>
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Settings
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleLogin}
            >
              Logout
            </button>
          </div>
            )}
        </div>
          
      )}
    </div>
  );
};

export default Navigator;
