const STATUS_ERROR_CODE_MAP = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "UNPROCESSABLE_ENTITY",
  429: "TOO_MANY_REQUESTS",
  500: "INTERNAL_SERVER_ERROR",
};

function createAppError(status, message, errorCode) {
  const error = new Error(message);
  error.status = status;
  error.errorCode = errorCode || STATUS_ERROR_CODE_MAP[status] || "UNKNOWN_ERROR";
  return error;
}

module.exports = {
  createAppError,
};
