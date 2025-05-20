import express from "express";
import {
  validateCreateBoard,
  validateUpdateBoard,
} from "../validators/boardValidator.js";
import handleValidationErrors from "../middlewares/validate.js";
import {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
} from "../controllers/boardController.js";
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
router.patch(
  "/:boardId",
  validateUpdateBoard,
  handleValidationErrors,
  authMiddleware,
  updateBoard
);
router.delete("/:boardId", authMiddleware, deleteBoard);

export default router;
