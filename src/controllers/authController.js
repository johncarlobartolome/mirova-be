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
      return createErrors(res, 400, "Email already in use", {
        code: "INVALID_EMAIL",
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
      return createErrors(res, 400, "Invalid credentials", {
        code: "INVALID_CREDENTIALS",
      });
    }

    const same = await bcrypt.compare(password, user.password);

    if (!same) {
      return createErrors(res, 400, "Invalid credentials", {
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
    const user = await User.findOne({ email });
    if (!user) {
      return createErrors(res, 400, "Email is not in use.", {
        code: "INVALID_EMAIL",
      });
    }
    const to = email;
    const subject = "Recover Password";
    const template = "forgotPassword";
    const resetToken = generateToken({ email }, "30m");
    const context = {
      resetLink: `http://localhost:3000/reset-password?resetToken=${resetToken}`,
      company: "Mirova",
    };
    const currentDate = new Date();
    const dateIn30Minutes = new Date(currentDate.getTime() + 30 * 60 * 1000);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = dateIn30Minutes;
    await user.save();
    await sendEmail(to, subject, template, context);
    createResponse(res, 200, "Recovery link sent");
  } catch (error) {
    console.log(error);
    createErrors(res, 500, "Server error", error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const resetPasswordToken = req.params.resetToken;

    const user = await User.findOne({ resetPasswordToken });
    if (!user) {
      return createErrors(res, 400, "Invalid reset token");
    }
    if (user.resetPasswordExpires < new Date()) {
      return createErrors(res, 400, "Reset token expired");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    createResponse(res, 200, "Password successfully changed");
  } catch (error) {
    console.log(error);
    createErrors(res, 500, "Server error", error);
  }
};
