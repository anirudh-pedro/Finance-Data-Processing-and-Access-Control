const { createAppError } = require("../utils/appError");

function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join(", ");
      return next(createAppError(400, message || "Validation error", "VALIDATION_ERROR"));
    }

    req[source] = result.data;
    return next();
  };
}

module.exports = validate;
