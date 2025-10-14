// src/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Debug logging
    console.log("🔍 Auth Header:", authHeader);
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: "Authorization header required" 
      });
    }

    // Check if header starts with Bearer
    if (!authHeader.startsWith('Bearer ')) {
      console.log("❌ Invalid auth header format:", authHeader);
      return res.status(401).json({ 
        message: "Authorization header must start with 'Bearer '" 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token || token === 'null' || token === 'undefined') {
      console.log("❌ No token provided or invalid token:", token);
      return res.status(401).json({ 
        message: "Access token required" 
      });
    }

    // Debug token format
    console.log("🎫 Token received:", token.substring(0, 20) + "...");
    console.log("🎫 Token length:", token.length);
    console.log("🎫 Token parts:", token.split('.').length);

    // JWT should have 3 parts separated by dots
    if (token.split('.').length !== 3) {
      console.log("❌ Invalid JWT format - should have 3 parts separated by dots");
      return res.status(401).json({ 
        message: "Invalid token format" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded successfully:", decoded);
    
    // Get user from database (optional, for extra security)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid token - user not found" 
      });
    }

    // Add user to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role
    };
    
    console.log("🔐 Authenticated user:", req.user.email);
    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error.name + ":", error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token format" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    
    res.status(500).json({ message: "Authentication error" });
  }
};

// Admin only middleware
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ 
      message: "Admin access required" 
    });
  }
  next();
};