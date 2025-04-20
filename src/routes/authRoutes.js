import express from "express";
import { signUp, signIn } from "../controllers/authController.js";
import {
  validateSignIn,
  validateSignUp,
} from "../middlewares/validationMiddleware.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

const router = express.Router();

router.post("/signup", validateSignUp, handleValidationErrors, signUp);
router.post("/signin", validateSignIn, handleValidationErrors, signIn);

export default router;
