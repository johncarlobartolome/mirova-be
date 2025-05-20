import { body } from "express-validator";

export const validateCreateBoard = [
  body("title").notEmpty().withMessage("Title is required"),
];

export const validateUpdateBoard = [
  body("title").optional().notEmpty().withMessage("Title is required"),
];
