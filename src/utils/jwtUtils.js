import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
export const generateToken = (payload) => {
  try {
    const { name, email } = payload;
    const token = jwt.sign(
      {
        name,
        email,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );
    return token;
  } catch (error) {
    console.log(error);
  }
};

export const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log(error);
  }
};
