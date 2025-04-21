import express from "express";
import {
  signUp,
  signIn,
  forgotPassword,
} from "../controllers/authController.js";
import {
  validateSignIn,
  validateSignUp,
} from "../middlewares/validationMiddleware.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

const router = express.Router();

router.post("/signup", validateSignUp, handleValidationErrors, signUp);
router.post("/signin", validateSignIn, handleValidationErrors, signIn);
router.post("/forgot-password", forgotPassword);

export default router;
