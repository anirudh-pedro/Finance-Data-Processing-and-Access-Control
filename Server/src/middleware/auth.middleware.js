const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { createAppError } = require("../utils/appError");

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        createAppError(401, "Missing or invalid authorization token", "MISSING_AUTH_TOKEN")
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;

    return next();
  } catch (error) {
    return next(createAppError(401, "Invalid or expired token", "INVALID_AUTH_TOKEN"));
  }
}

module.exports = authMiddleware;
