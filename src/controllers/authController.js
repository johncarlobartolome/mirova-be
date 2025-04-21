import bcrypt from "bcrypt";
import { generateToken } from "../services/jwtService.js";
import User from "../models/User.js";
import createErrors from "../utils/errors.js";
import createResponse from "../utils/response.js";
import { sendEmail } from "../services/emailService.js";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exist = await User.findOne({ email });

    if (exist) {
      createErrors(res, 400, "Email already in use", { code: "INVALID_EMAIL" });
      res.status(400).json({
        message: "Email already in use.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = generateToken({ name, email });

    createResponse(res, 201, "User created successfully", { token });
  } catch (error) {
    console.log(error);
    createErrors(res, 500, "Server error", error);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      createErrors(res, 400, "Invalid credentials", {
        code: "INVALID_CREDENTIALS",
      });
    }

    const same = await bcrypt.compare(password, user.password);

    if (!same) {
      createErrors(res, 400, "Invalid credentials", {
        code: "INVALID_CREDENTIALS",
      });
    }

    const { _id, name } = user;

    const token = generateToken({ _id, name, email }, "2h");
    createResponse(res, 200, "Login successful", { token });
  } catch (error) {
    console.log(error);
    createErrors(res, 500, "Server error", error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const to = email;
    const subject = "Recover Password";
    const template = "forgotPassword";
    const resetToken = generateToken({ email }, "30m");
    const context = {
      resetLink: `http://localhost:3000/reset-password?token=${resetToken}`,
      company: "Mirova",
    };
    await sendEmail(to, subject, template, context);
    createResponse(res, 200, "Recovery link sent");
  } catch (error) {
    console.log(error);
    createErrors(res, 500, "Server error", error);
  }
};
