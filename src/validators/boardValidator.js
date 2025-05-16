import { body } from "express-validator";

export const validateCreateBoard = [
  body("title").notEmpty().withMessage("Title is required"),
];
