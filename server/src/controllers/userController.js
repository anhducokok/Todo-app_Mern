import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import { jwtService } from "express-jwt";
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    console.log("Registration - Original password:", password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Registration - Hashed password:", hashedPassword);
    
    // Test the hash immediately to make sure it works
    const immediateTest = await bcrypt.compare(password, hashedPassword);
    console.log("Registration - Immediate hash test:", immediateTest);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user", // default role
    });

    // Save user first
    await newUser.save();
    console.log("User saved successfully:", newUser._id);

    // Generate JWT token AFTER saving
    const token = jwt.sign({ 
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
    res.status(201).json({ 
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  let { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    
    // Trim whitespace from inputs
    email = email.trim().toLowerCase();
    password = password.trim();
    
    console.log("Login attempt - Email:", email);
    console.log("Login attempt - Password:", password);
    console.log("Password length:", password.length);
    // Find user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("Found user:", user);
    console.log("Comparing password:", password, "with hash:", user.password);
    
    // Debug: Test with the exact password that was used during registration
    console.log("Testing password comparison...");
    
    // Test 1: Try comparing with the provided password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);
    
    // Test 2: Let's try some common passwords to debug
    const testPasswords = ['password123', 'Password123', '123456', 'test123'];
    for (let testPass of testPasswords) {
      const testResult = await bcrypt.compare(testPass, user.password);
      console.log(`Testing "${testPass}": ${testResult}`);
    }
    
    // Test 3: Create a fresh hash with the same password and see if it works
    const freshHash = await bcrypt.hash(password, 10);
    const freshTest = await bcrypt.compare(password, freshHash);
    console.log("Fresh hash test (should be true):", freshTest);
    
    if (!isMatch) {
      console.log("Invalid password for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (req, res) => {
  // Since JWT is stateless, logout can be handled on the client side by deleting the token
  res.status(200).json({ message: "Logged out successfully" });
};

export { register, login, logout };
