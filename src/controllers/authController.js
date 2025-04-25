import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { performance } from "perf_hooks";
import redisClient from "../config/redisClient.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateToken,
  verifyToken,
} from "../services/tokenService.js";
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
        details: [
          {
            path: "email",
            msg: "Email already in use",
          },
        ],
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const payload = {
      _id: user._id,
      name,
      email,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    createResponse(
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }),
      200,
      "Signup successful",
      { accessToken }
    );
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
        details: [
          {
            path: "email",
            msg: "Invalid credentials",
          },
        ],
      });
    }

    const same = await bcrypt.compare(password, user.password);

    if (!same) {
      return createErrors(res, 400, "Invalid credentials", {
        code: "INVALID_CREDENTIALS",
        details: [
          {
            path: "email",
            msg: "Invalid credentials",
          },
        ],
      });
    }

    const payload = {
      _id: user._id,
      name: user._name,
      email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    console.log(refreshToken, user._id.toString());
    await redisClient.set(refreshToken, user._id.toString(), {
      EX: 7 * 24 * 60 * 60,
    });
    createResponse(
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }),
      200,
      "Login successful",
      { accessToken }
    );
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
      return createErrors(res, 400, "Email is not in use", {
        code: "INVALID_EMAIL",
        details: [
          {
            path: "email",
            msg: "Email is not in use",
          },
        ],
      });
    }
    const to = email;
    const subject = "Recover Password";
    const template = "forgotPassword";
    const resetToken = generateToken({ email }, "30m");
    const context = {
      resetLink: `http://localhost:5173/reset-password?resetToken=${resetToken}`,
      company: "Mirova",
    };
    const currentDate = new Date();
    const dateIn30Minutes = new Date(currentDate.getTime() + 30 * 60 * 1000);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = dateIn30Minutes;
    await user.save();
    const start = performance.now();
    await sendEmail(to, subject, template, context);
    const end = performance.now();
    console.log(`Execution took ${end - start} ms`);
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
    createErrors(res, 500, "Server error", error);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) return createErrors(res, 401, "Unauthorized", {});

    const userId = await redisClient.get(token);
    if (!userId) return createErrors(res, 403, "Forbidden");
    const decoded = await verifyToken(token, "REFRESH_TOKEN");
    const { _id, name, email } = decoded;
    const objectId = new mongoose.Types.ObjectId(_id);
    const accessToken = generateAccessToken({ _id: objectId, name, email });
    createResponse(res, 200, "Access token refreshed", { accessToken });
  } catch (error) {
    console.log(error);
    createErrors(res, 500, "Server error", error);
  }
};
