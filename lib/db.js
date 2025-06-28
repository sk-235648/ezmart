// lib/db.js
import mongoose from 'mongoose';

const connections = {
  ezmart: null,
  'ezmart-admin': null
};

export async function connectDB(dbName = 'ezmart') {
  // Reuse existing connection if it exists
  if (connections[dbName]) {
    return connections[dbName];
  }

  try {
    // Create a new connection for this database
    const conn = await mongoose.createConnection(process.env.MONGODB_URI, {
      dbName,
    });

    connections[dbName] = conn;
    console.log(`✅ MongoDB connected to "${dbName}"`);

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error (${dbName}):`, error);
    throw error;
  }
}