import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, errors } = format;

// 1. Define log message format
const logFormat = printf(({ timestamp, level, message, stack }) => {
  // if it's an error with stack trace, log the stack; otherwise the message
  const msg = stack || message;
  return `${timestamp} [${level}]: ${msg}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // capture stack trace
    logFormat
  ),
  transports: [
    // 2. Rotate a new file each day
    new DailyRotateFile({
      filename: "logs/app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "14d", // keep logs for 14 days
      level: "info",
    }),
    // 3. Separate errors into their own file
    new transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
});

// 4. In non-production, also log to the console with colors
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(colorize(), logFormat),
    })
  );
}

export default logger;
