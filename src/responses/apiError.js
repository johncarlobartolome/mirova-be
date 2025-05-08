export class FieldError {
  constructor(field, message) {
    this.field = field;
    this.message = message;
  }
}

export class APIError extends Error {
  constructor(code, message, statusCode = 500, details = null, errors = []) {
    super(message);
    this.status = false;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.errors = errors;
    this.name = this.constructor.name;
  }

  toDict() {
    const errorDict = {
      status: this.status,
      code: this.code,
      message: this.message,
    };

    if (this.details) {
      errorDict.details = this.details;
    }

    if (this.errors && this.errors.length > 0) {
      errorDict.errors = this.errors.map((e) => ({
        field: e.field,
        message: e.message,
      }));
    }
    return errorDict;
  }

  toJson() {
    return JSON.stringify(this.toDict());
  }

  static fromException(
    error,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    message = "Internal server error."
  ) {
    const details = {
      type: error.constructor.name,
      message: error.message,
      stack: error.stack,
    };
    return new APIError(code, message, statusCode, details);
  }

  static validationError(message = "Validation Error", errors = []) {
    return new APIError("VALIDATION_ERROR", message, 400, null, errors);
  }
}
