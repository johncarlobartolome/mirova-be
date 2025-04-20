import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./connectDB.js";

import authRouter from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

connectDB;

export default app;
