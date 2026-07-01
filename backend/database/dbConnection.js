import mongoose from "mongoose";

export const dbConnection = () => {
  console.log("MONGO_URI:", process.env.MONGO_URI);
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "NIT_DELHI_PLACEMENT_PORTAL",
    })
    .then(() => {
      console.log("Connected to MongoDB Atlas!");
    })
    .catch((err) => {
      console.log("MongoDB connection error:", err);
    });
};
