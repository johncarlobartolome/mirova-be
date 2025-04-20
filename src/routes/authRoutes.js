import express from "express";
import { signUp } from "../controllers/authController.js";
import { validateSignUp } from "../middlewares/validationMiddleware.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

const router = express.Router();

router.post("/signup", validateSignUp, handleValidationErrors, signUp);

export default router;
