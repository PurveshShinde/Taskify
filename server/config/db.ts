import mongoose from 'mongoose';

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('[MongoDB Error] MONGO_URI is not defined in server/.env.');
    return false;
  }

  // Check for valid scheme
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('[MongoDB Error] MONGO_URI has an invalid scheme. It must start with "mongodb://" or "mongodb+srv://".');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.error('\n======================================================');
    if (error?.code === 8000 || error?.message?.includes('bad auth') || error?.codeName === 'AtlasError') {
      console.error('[MongoDB Atlas Auth Error] Authentication failed (Atlas Code 8000).');
      console.error('The database username or password in your MONGO_URI is incorrect or has expired in MongoDB Atlas.');
      console.error('\nHow to fix:');
      console.error('1. Go to MongoDB Atlas: https://cloud.mongodb.com/');
      console.error('2. Navigate to "Security" -> "Database Access"');
      console.error('3. Check your database username (e.g. shindepurvesh007_db_user)');
      console.error('4. Click "Edit" -> "Edit Password" to reset/confirm the password');
      console.error('5. Update server/.env with:');
      console.error('   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.aiyx0d8.mongodb.net/taskify?retryWrites=true&w=majority');
      console.error('6. Under "Security" -> "Network Access", verify your IP address or 0.0.0.0/0 is whitelisted.');
    } else {
      console.error('[MongoDB Connection Error]:', error?.message || error);
    }
    console.error('======================================================\n');
    console.warn('[Server Notice] Server is running, but database connection failed. Database operations will fail until valid Atlas credentials are provided.');
    return false;
  }
};
