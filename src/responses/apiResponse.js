export class ApiResponse {
  constructor(
    success = true,
    statusCode = 200,
    message = "Request successful",
    data
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}
