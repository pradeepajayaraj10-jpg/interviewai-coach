import mongoose from 'mongoose';

let isConnected = false;
let connectionAttempted = false;

export async function connectDB(): Promise<boolean> {
  if (isConnected) return true;
  if (connectionAttempted && !isConnected) return false;

  connectionAttempted = true;
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('cluster.mongodb.net/interviewai') && !process.env.MONGODB_URI_OVERRIDE) {
    console.info('[Database] No active MongoDB URI configured. Using high-performance in-memory/persisted data engine.');
    return false;
  }

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    isConnected = !!conn.connection.readyState;
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`[Database] MongoDB connection failed (${error.message}). Falling back to local storage engine.`);
    isConnected = false;
    return false;
  }
}

export function isMongoActive(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
