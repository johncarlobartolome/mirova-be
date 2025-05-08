import { APIError } from "./apiError.js";

export class FormError extends APIError {
  constructor(validationErrors) {
    super(false, 400, "Validation failed", "FORM_VALIDATION", validationErrors);
  }
}
