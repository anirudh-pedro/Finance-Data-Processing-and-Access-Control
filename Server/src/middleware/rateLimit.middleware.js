const rateLimit = require("express-rate-limit");

const rateLimitErrorResponse = {
  success: false,
  message: "Too many requests",
  errorCode: "RATE_LIMIT_EXCEEDED",
};

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitErrorResponse,
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitErrorResponse,
});

module.exports = {
  globalLimiter,
  authLimiter,
};
