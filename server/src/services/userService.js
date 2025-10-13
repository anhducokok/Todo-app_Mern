import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserService {
  // Validate user registration data
  validateRegistration(userData) {
    const { username, email, password } = userData;
    const errors = [];

    if (!username || username.trim().length < 3) {
      errors.push("Tên người dùng phải có ít nhất 3 ký tự");
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errors.push("Email không hợp lệ");
    }

    if (!password || password.length < 6) {
      errors.push("Mật khẩu phải có ít nhất 6 ký tự");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate login data
  validateLogin(loginData) {
    const { email, password } = loginData;
    const errors = [];

    if (!email || !email.trim()) {
      errors.push("Email là bắt buộc");
    }

    if (!password || !password.trim()) {
      errors.push("Mật khẩu là bắt buộc");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate JWT token
  generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  }

  // Format user response (exclude sensitive data)
  formatUserResponse(user) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }

  // Register new user - BUSINESS LOGIC ONLY
  async registerUser(userData) {
    try {
      const { username, email, password } = userData;

      // Business logic validation
      const validation = this.validateRegistration(userData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      // Use repository to check if user already exists
      const existingUser = await userRepository.findByEmailOrUsername(email, username);
      
      if (existingUser) {
        throw new Error("Email hoặc tên người dùng đã tồn tại");
      }

      // Business logic: Hash password
      const hashedPassword = await bcrypt.hash(password.trim(), 12);

      // Prepare user data
      const newUserData = {
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "user",
      };

      // Use repository to create user
      const savedUser = await userRepository.createUser(newUserData);

      // Business logic: Generate token
      const token = this.generateToken(savedUser);

      return {
        message: "Đăng ký thành công",
        token,
        user: this.formatUserResponse(savedUser)
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Login user - BUSINESS LOGIC ONLY
  async loginUser(loginData) {
    try {
      const { email, password } = loginData;

      // Business logic validation
      const validation = this.validateLogin(loginData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      // Use repository to find user with password
      const user = await userRepository.findByEmailWithPassword(email);

      if (!user) {
        throw new Error("Email hoặc mật khẩu không chính xác");
      }

      // Business logic: Compare password
      const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
      if (!isPasswordValid) {
        throw new Error("Email hoặc mật khẩu không chính xác");
      }

      // Business logic: Generate token
      const token = this.generateToken(user);

      return {
        message: "Đăng nhập thành công",
        token,
        user: this.formatUserResponse(user)
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Get user profile - BUSINESS LOGIC ONLY
  async getUserProfile(userId) {
    try {
      // Use repository to find user
      const user = await userRepository.findById(userId);
      
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      // Business logic: Format response
      return this.formatUserResponse(user);
    } catch (error) {
      throw new Error(`Failed to get profile: ${error.message}`);
    }
  }

  // Update user profile - BUSINESS LOGIC ONLY
  async updateUserProfile(userId, updateData) {
    try {
      const { username, email } = updateData;
      const updateFields = {};

      // Business logic validation and preparation
      if (username) {
        if (username.trim().length < 3) {
          throw new Error("Tên người dùng phải có ít nhất 3 ký tự");
        }
        updateFields.username = username.trim();
      }

      if (email) {
        if (!/\S+@\S+\.\S+/.test(email)) {
          throw new Error("Email không hợp lệ");
        }
        updateFields.email = email.toLowerCase().trim();
      }

      // Use repository to update user
      const updatedUser = await userRepository.updateUserById(userId, updateFields);

      if (!updatedUser) {
        throw new Error("Không tìm thấy người dùng");
      }

      return {
        message: "Cập nhật thông tin thành công",
        user: this.formatUserResponse(updatedUser)
      };
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }
}

export default new UserService();