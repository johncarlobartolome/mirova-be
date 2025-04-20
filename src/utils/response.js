export default function createResponse(res, statusCode, message, data) {
  return res.status(statusCode).json({
    success: true,
    message: message || "Operation succesfful",
    data: data || null,
    error: null,
  });
}
