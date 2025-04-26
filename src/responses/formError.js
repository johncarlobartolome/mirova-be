import { AppError } from "./appError.js";

export class FormError extends AppError {
  constructor(validationErrors) {
    super("Validation failed", 400, "FORM_VALIDATION", validationErrors);
  }
}
