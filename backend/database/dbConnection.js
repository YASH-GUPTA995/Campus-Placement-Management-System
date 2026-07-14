import mongoose from "mongoose";

export const dbConnection = () => {
  console.log("MONGO_URL:", process.env.MONGO_URL);

  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "NIT_DELHI_PLACEMENT_PORTAL",
    })
    .then(() => {
      console.log("Connected to MongoDB Atlas!");
    })
    .catch((err) => {
      console.log("MongoDB connection error:", err);
    });
};
