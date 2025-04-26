export class AppError extends Error {
  constructor(message, statusCode = 500, errorType, details) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.name = this.constructor.name;
  }
}
