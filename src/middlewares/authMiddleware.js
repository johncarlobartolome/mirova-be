import { verifyToken } from "../services/tokenService.js";
import { APIError } from "../responses/apiError.js";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new APIError(
      "INVALID_TOKEN",
      "No token provided or invalid format.",
      401
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token, "ACCESS_TOKEN");
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    throw new APIError("INVALID_TOKEN", "Invalid or expired token.", 401);
  }
}
