function errorMiddleware(err, req, res, next) {
  const status = err.status || 500;
  const errorCode = err.errorCode || "INTERNAL_SERVER_ERROR";
  const message = status >= 500 ? "Internal server error" : err.message || "Unexpected error";

  return res.status(status).json({
    success: false,
    message,
    errorCode,
  });
}

module.exports = errorMiddleware;
