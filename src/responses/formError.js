import { AppError } from "./appError.js";

export class FormError extends AppError {
  constructor(validationErrors) {
    super(false, 400, "Validation failed", "FORM_VALIDATION", validationErrors);
  }
}
