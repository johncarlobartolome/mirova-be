import express from "express";
import { validateCreateBoard } from "../validators/boardValidator.js";
import handleValidationErrors from "../middlewares/validate.js";
import { createBoard, getBoards } from "../controllers/boardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  validateCreateBoard,
  handleValidationErrors,
  authMiddleware,
  createBoard
);
router.get("/", authMiddleware, getBoards);

export default router;
