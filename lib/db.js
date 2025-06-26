import mongoose from 'mongoose';

const connection = {
  isConnected: false,
  dbName: null,
};

export async function connectDB(dbName = 'ezmart') {
  // Reuse existing connection if it's already connected to the correct DB
  if (connection.isConnected && connection.dbName === dbName) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName,
     
    });

    connection.isConnected = true;
    connection.dbName = dbName;

    console.log(`✅ MongoDB connected to "${dbName}"`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}
