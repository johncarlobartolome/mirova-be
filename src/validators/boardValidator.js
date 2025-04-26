import { body } from "express-validator";

export const validateCreateBoard = [
  body("title").notEmpty().withMessage(" is required"),
];
