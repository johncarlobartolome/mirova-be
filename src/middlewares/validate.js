import { validationResult } from "express-validator";
import { FormError } from "../responses/formError.js";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => {
      return { field: err.path, msg: err.msg };
    });
    throw new FormError(formattedErrors);
  }
  next();
};

export default validateRequest;
