import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connection established");
    });
    await mongoose.connect(process.env.MONGODB_URI);
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
