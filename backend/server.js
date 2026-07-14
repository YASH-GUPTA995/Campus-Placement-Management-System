import app from "./app.js";
import cloudinary from "cloudinary";
import { dbConnection } from "./database/dbConnection.js";
import dotenv from "dotenv";

// dotenv.config({ path: "./config/config.env" });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



dbConnection();


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
