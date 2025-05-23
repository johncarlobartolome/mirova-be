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
import { ApiResponse } from "../responses/apiResponse.js";
import { sendEmail } from "../services/emailService.js";
import { APIError, FieldError } from "../responses/apiError.js";
import { FormError } from "../responses/formError.js";

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exist = await User.findOne({ email });

    if (exist) {
      const errors = [];
      errors.push(new FieldError("email", "Email is already in use."));
      throw new APIError(
        "RESOURCE_CONFLICT",
        "User already exists.",
        400,
        null,
        errors
      );
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

    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        message: "Signup successful.",
        data: {
          accessToken,
        },
        error: null,
      });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const errors = [];
      errors.push(new FieldError("email", "Invalid credentials."));
      throw new APIError(
        "AUTHENTICATION_FAILED",
        "Invalid credentials.",
        400,
        null,
        errors
      );
    }

    const same = await bcrypt.compare(password, user.password);

    if (!same) {
      const errors = [];
      errors.push(new FieldError("email", "Invalid credentials."));
      throw new APIError(
        "AUTHENTICATION_FAILED",
        "Invalid credentials.",
        400,
        null,
        errors
      );
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
    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        message: "Signin successful.",
        data: {
          accessToken,
        },
        error: null,
      });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const errors = [];
      errors.push(
        new FieldError(
          "email",
          "This email address is not registered in our system."
        )
      );
      throw new APIError(
        "INVALID_REQUEST",
        "Invalid email provided.",
        400,
        null,
        errors
      );
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
    return res.status(200).json({
      success: true,
      message: "Recovery link sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const resetPasswordToken = req.params.resetToken;

    const user = await User.findOne({ resetPasswordToken });
    if (!user) {
      const errors = [];
      errors.push(new FieldError("password", "Invalid reset token."));
      throw new APIError(
        "INVALID_TOKEN",
        "Invalid reset token.",
        400,
        null,
        errors
      );
    }
    if (user.resetPasswordExpires < new Date()) {
      const errors = [];
      errors.push(new FieldError("password", "Reset token expired."));
      throw new APIError(
        "TOKEN_EXPIRED",
        "Reset token expired.",
        400,
        null,
        errors
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password successfully changed.",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      throw new APIError("UNAUTHORIZED", "Unauthorized", 401);
    }

    const userId = await redisClient.get(token);
    if (!userId) {
      throw new APIError("FORBIDDEN", "Forbidden", 403);
    }
    const decoded = verifyToken(token, "REFRESH_TOKEN");
    const { _id, name, email } = decoded;
    const objectId = new mongoose.Types.ObjectId(_id);
    const accessToken = generateAccessToken({ _id: objectId, name, email });
    return res.status(201).json({
      success: true,
      message: "Access token refreshed.",
      data: {
        accessToken,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};
