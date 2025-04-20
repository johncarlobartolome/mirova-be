import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwtUtils.js";
import User from "../models/User.js";
import createErrors from "../utils/errors.js";
import createResponse from "../utils/response.js";

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
