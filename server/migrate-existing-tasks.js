// scripts/migrate-existing-tasks.js
import mongoose from 'mongoose';
import Task from './src/models/Task.js';
import User from './src/models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskapp';
    console.log('🔗 Connecting to MongoDB:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const migrateExistingTasks = async () => {
  try {
    await connectDB();
    
    // Get the current user (user bạn đang test)
    const user = await User.findOne({ email: 'test1@gmail.com' });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('👤 Found user:', user.email, 'ID:', user._id);
    
    // Find tasks without userId
    const tasksWithoutUserId = await Task.find({
      $or: [
        { userId: { $exists: false } },
        { userId: null }
      ]
    });
    
    console.log(`📋 Found ${tasksWithoutUserId.length} tasks without userId`);
    
    if (tasksWithoutUserId.length > 0) {
      // Update all tasks to belong to this user
      const result = await Task.updateMany(
        {
          $or: [
            { userId: { $exists: false } },
            { userId: null }
          ]
        },
        { userId: user._id }
      );
      
      console.log(`✅ Updated ${result.modifiedCount} tasks with userId`);
      
      // Verify
      const allTasksWithUser = await Task.find({ userId: user._id });
      console.log(`🎉 Total tasks for user now: ${allTasksWithUser.length}`);
    } else {
      console.log('✅ All tasks already have userId');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
};

migrateExistingTasks();