import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./connectDB.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB;

export default app;
