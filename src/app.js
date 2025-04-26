import "dotenv/config";
import express from "express";
import cors from "cors";
import expressWinston from "express-winston";
import logger from "./utils/logger.js";

import connectDB from "./connectDB.js";

import authRouter from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";

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
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    msg: `{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms`,
    meta: false,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/boards", boardRoutes);

app.use(errorHandler);
// app.use(
//   expressWinston.errorLogger({
//     winstonInstance: logger,
//   })
// );

connectDB;

export default app;
