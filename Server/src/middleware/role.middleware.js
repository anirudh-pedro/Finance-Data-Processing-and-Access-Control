const { createAppError } = require("../utils/appError");

function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return next(createAppError(401, "Unauthorized", "UNAUTHORIZED"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        createAppError(403, "Forbidden: insufficient role permissions", "FORBIDDEN")
      );
    }

    return next();
  };
}

module.exports = roleMiddleware;
