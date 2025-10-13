import User from "../models/User.js";
import mongoose from "mongoose";

class UserRepository {
  // Find user by email
  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase().trim() }).lean();
  }

  // Find user by email with password field
  async findByEmailWithPassword(email) {
    return await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).select("+password");
  }

  // Find user by username
  async findByUsername(username) {
    return await User.findOne({ username }).lean();
  }

  // Find user by email or username
  async findByEmailOrUsername(email, username) {
    return await User.findOne({ 
      $or: [
        { email: email.toLowerCase().trim() }, 
        { username: username.trim() }
      ] 
    }).lean();
  }

  // Find user by ID
  async findById(userId) {
    return await User.findById(userId).lean();
  }

  // Create new user
  async createUser(userData) {
    const newUser = new User(userData);
    return await newUser.save();
  }

  // Update user by ID
  async updateUserById(userId, updateData, options = {}) {
    return await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true,
        ...options
      }
    );
  }

  // Delete user by ID (soft delete)
  async deleteUserById(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { 
        isDeleted: true, 
        deletedAt: new Date() 
      },
      { new: true }
    );
  }

  // Check if user exists by email
  async existsByEmail(email) {
    return await User.exists({ email: email.toLowerCase().trim() });
  }

  // Check if user exists by username
  async existsByUsername(username) {
    return await User.exists({ username: username.trim() });
  }

  // Check if user exists by email or username
  async existsByEmailOrUsername(email, username) {
    return await User.exists({
      $or: [
        { email: email.toLowerCase().trim() },
        { username: username.trim() }
      ]
    });
  }

  // Get all users (with pagination)
  async findAllUsers(limit = 10, skip = 0, filter = {}) {
    return await User.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();
  }

  // Count users
  async countUsers(filter = {}) {
    return await User.countDocuments(filter);
  }

  // Update user password
  async updatePassword(userId, hashedPassword) {
    return await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
  }

  // Find users by role
  async findByRole(role) {
    return await User.find({ role }).lean();
  }

  // Update user role
  async updateUserRole(userId, role) {
    return await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );
  }

  // Utility: Convert string ID to ObjectId
  toObjectId(id) {
    return new mongoose.Types.ObjectId(id);
  }

  // Utility: Build base query with common filters
  buildBaseQuery(includeDeleted = false) {
    const query = {};
    
    if (!includeDeleted) {
      query.isDeleted = { $ne: true };
    }
    
    return query;
  }

  // Search users by username or email
  async searchUsers(searchTerm, limit = 10) {
    const regex = new RegExp(searchTerm, 'i');
    return await User.find({
      $or: [
        { username: { $regex: regex } },
        { email: { $regex: regex } }
      ],
      isDeleted: { $ne: true }
    })
    .limit(limit)
    .lean();
  }

  // Get user statistics
  async getUserStats() {
    return await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $ne: ["$isDeleted", true] }, 1, 0] }
          },
          adminUsers: {
            $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] }
          },
          regularUsers: {
            $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] }
          }
        }
      }
    ]);
  }
}

export default new UserRepository();
