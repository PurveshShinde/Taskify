export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('CRITICAL ERROR: MONGO_URI is not defined in environment variables.');
    process.exit(1);
  }

  // Check for valid scheme
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('CRITICAL ERROR: MONGO_URI has an invalid scheme. It must start with "mongodb://" or "mongodb+srv://"');
    console.error(`Current URI Value (masked): ${uri.substring(0, 10)}...`);
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

import mongoose from 'mongoose';