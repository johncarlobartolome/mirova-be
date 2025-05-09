import { verifyToken } from "../services/tokenService.js";
import { AppError } from "../responses/appError.js";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return createErrors(res, 401, "No token provided or invalid format", {});
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token, "ACCESS_TOKEN");
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return createErrors(res, 403, "Invalid or expired token");
  }
}
