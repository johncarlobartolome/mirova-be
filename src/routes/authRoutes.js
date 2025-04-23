import express from "express";
import {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../controllers/authController.js";
import {
  validateSignIn,
  validateSignUp,
  validateForgotPassword,
} from "../middlewares/validationMiddleware.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

const router = express.Router();

router.post("/signup", validateSignUp, handleValidationErrors, signUp);
router.post("/signin", validateSignIn, handleValidationErrors, signIn);
router.post(
  "/forgot-password",
  validateForgotPassword,
  handleValidationErrors,
  forgotPassword
);
router.post("/reset-password/:resetToken", resetPassword);
router.post("/refresh-token", refreshToken);

export default router;
