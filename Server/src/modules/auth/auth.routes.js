const express = require("express");
const authController = require("./auth.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");
const { authLimiter } = require("../../middleware/rateLimit.middleware");
const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/sendResponse");
const { registerSchema, loginSchema } = require("../../validation/auth.schemas");

const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);

router.get(
  "/protected",
  authMiddleware,
  asyncHandler(async (req, res) => {
    return sendResponse(res, {
      status: 200,
      message: "Protected route accessed",
      data: req.user,
    });
  })
);

router.get(
  "/protected/admin",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  asyncHandler(async (req, res) => {
    return sendResponse(res, {
      status: 200,
      message: "Admin protected route accessed",
      data: req.user,
    });
  })
);

module.exports = router;
