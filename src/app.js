import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./connectDB.js";

import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = ["http://localhost:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

connectDB;

export default app;
