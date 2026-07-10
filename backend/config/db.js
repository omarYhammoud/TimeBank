import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI?.trim();

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing from .env");
    }

    const connection = await mongoose.connect(mongoUri, {
      dbName: "timebank",
    });

    console.log(
      `✅ MongoDB Connected: ${connection.connection.host}`
    );

    console.log(
      `✅ Database Name: ${connection.connection.name}`
    );
  } catch (error) {
    console.error(`❌ Database Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;