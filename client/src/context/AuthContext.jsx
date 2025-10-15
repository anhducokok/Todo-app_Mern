import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '@/api/auth';

// Tạo AuthContext
const AuthContext = createContext();

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component để wrap toàn bộ app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status khi app khởi động
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
          console.log('✅ User already logged in:', JSON.parse(storedUser).email);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        handleLogout(); // Clear invalid data
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      
      // Clear any existing malformed token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const data = await apiLogin(email, password);
      
      if (data.token && data.user) {
        // Store in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update state
        setToken(data.token);
        setUser(data.user);
        setIsLoggedIn(true);
        
        console.log('✅ Login successful:', data.user.email);
        return { success: true, user: data.user };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear state
      setToken(null);
      setUser(null);
      setIsLoggedIn(false);
      
      console.log('✅ Logout successful');
      
      // Optional: Call API logout endpoint
      apiLogout();
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  // Check if user is authenticated
  const checkAuthentication = () => {
    return isLoggedIn && token && user;
  };

  const value = {
    // State
    user,
    token,
    loading,
    isLoggedIn,
    
    // Functions
    login: handleLogin,
    logout: handleLogout,
    getAuthHeaders,
    checkAuthentication,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};