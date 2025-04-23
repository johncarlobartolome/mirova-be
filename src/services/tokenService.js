import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const SECRETS = {
  RESET_TOKEN: JWT_SECRET,
  ACCESS_TOKEN: ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN: REFRESH_TOKEN_SECRET,
};

export const generateToken = (payload, expiresIn) => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token, type) => {
  try {
    const decoded = jwt.verify(token, SECRETS[type]);
    return decoded;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
