import { validationResult } from "express-validator";
import { FormError } from "../responses/formError.js";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new FormError(errors.array());
  }
  next();
};

export default validateRequest;
