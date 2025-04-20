export default function createErrors(
  res,
  statusCode = 500,
  message,
  errorDetails
) {
  return res.status(statusCode).json({
    success: false,
    message: message || "Operation failed",
    data: null,
    error: {
      code: errorDetails.code || "SERVER_ERROR",
      details: errorDetails.details || null,
    },
  });
}
