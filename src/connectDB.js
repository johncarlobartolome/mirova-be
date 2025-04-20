import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
const connectDB = mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connection successful.");
  })
  .catch((err) => {
    console.log(`Error connecting to MongoDB`, err);
  });

export default connectDB;
