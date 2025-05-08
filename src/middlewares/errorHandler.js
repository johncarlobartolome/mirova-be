import { ApiResponse } from "../responses/apiResponse.js";
import { APIError } from "../responses/apiError.js";
import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error("Unhandled error", err);
  if (err instanceof APIError) {
    return res.status(err.statusCode).json(err.toDict());
  }

  // Fallback to generic error
  return res.status(500).json({
    success: false,
    code: "SERVER_ERROR",
    message: "Something went wrong",
  });
};

export default errorHandler;
