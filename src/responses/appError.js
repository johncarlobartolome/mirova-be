export class AppError extends Error {
  constructor(success = false, statusCode = 500, message, errorType, details) {
    super(message);
    this.success = success;
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.name = this.constructor.name;
  }
}
