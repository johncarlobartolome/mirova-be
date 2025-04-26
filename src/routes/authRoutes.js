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
  validateResetPassword,
} from "../validators/authValidator.js";
import validateRequest from "../middlewares/validate.js";

const router = express.Router();

router.post("/signup", validateSignUp, validateRequest, signUp);
router.post("/signin", validateSignIn, validateRequest, signIn);
router.post(
  "/forgot-password",
  validateForgotPassword,
  validateRequest,
  forgotPassword
);
router.post(
  "/reset-password/:resetToken",
  validateResetPassword,
  validateRequest,
  resetPassword
);
router.post("/refresh-token", refreshToken);

export default router;
