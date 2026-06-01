import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log("MONGO_URI =", process.env.MONGO_URI);

    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_hostel_production';
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 50,
      wtimeoutMS: 2500,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Database connected successfully: ${conn.connection.host}`);
    
    // Handle subsequent connection errors
    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB] Runtime Connection Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Database connection lost. Attempting to reconnect...');
    });

  } catch (error) {
    console.error(`[MongoDB] Initial Connection Failure: ${error.message}`);
    process.exit(1);
  }
};
