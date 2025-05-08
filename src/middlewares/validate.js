import { validationResult } from "express-validator";
import { APIError, FieldError } from "../responses/apiError.js";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => {
      return new FieldError(err.path, err.msg);
    });
    console.log(formattedErrors);
    return next(APIError.validationError("Validation error.", formattedErrors));
  }
  next();
};

export default validateRequest;
