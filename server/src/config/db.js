import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI || process.env.MONGO_DB
        );
        console.log("MongoDB connected");
        console.log("Database name:", mongoose.connection.db.databaseName);
    } catch (error) {
        console.log("MongoDB not connected");
        process.exit(1);
    }
}