import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import tpoRoutes from "./routes/tpoRoutes.js";

dotenv.config({ path: "./config/config.env" });

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL_STUDENT,
  process.env.FRONTEND_URL_TPO,
  process.env.FRONTEND_URL_COMPANY,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://localhost:5173",
  "https://localhost:5174",
  "https://localhost:5175",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Mount routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/tpo", tpoRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "NIT Delhi Placement Portal API is running." });
});

app.use(errorMiddleware);

export default app;
