// test-connection.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';
    console.log('Testing connection to:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connection successful!');
    
    // List databases
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Available databases:', dbs.databases.map(db => db.name));
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
};

testConnection();