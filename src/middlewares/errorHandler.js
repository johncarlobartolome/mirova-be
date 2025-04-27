import { ApiResponse } from "../responses/apiResponse.js";
import { AppError } from "../responses/appError.js";
import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error("Unhandled error", err);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorType: err.errorType,
      details: err.details,
      timestamp: err.timestamp,
    });
  }

  // Fallback to generic error
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
    timestamp: new Date().toISOString(),
  });
};

export default errorHandler;
