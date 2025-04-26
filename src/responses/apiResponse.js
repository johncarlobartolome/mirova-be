export class ApiResponse {
  constructor(data, message = "Request successful", statusCode = 200) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}
