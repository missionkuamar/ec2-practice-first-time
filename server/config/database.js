// server/config/database.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    // Mask password for display
    const safeURI = process.env.MONGODB_URI.replace(
      /:\/\/[^:]+:[^@]+@/,
      "://***:***@"
    );
    console.log("MongoDB URI:", safeURI);

    // Mongoose v7+ → NO OPTIONS REQUIRED
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.db.databaseName}`);

    // Test collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(
      "Collections:",
      collections.length ? collections.map((c) => c.name) : "No collections found"
    );

  } catch (error) {
    console.error("=== MONGODB CONNECTION ERROR ===");
    console.error("Error:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
};

export default connectDB;
