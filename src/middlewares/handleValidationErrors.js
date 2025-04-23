import { validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Invalid inputs",
      data: null,
      error: {
        code: "INVALID_INPUTS",
        details: errors.array(),
      },
    });
  }
  next();
};

export default handleValidationErrors;
