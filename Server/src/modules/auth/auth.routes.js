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

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, ANALYST, VIEWER]
 *             required: [name, email, password]
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation or request error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Resource not found
 */
router.post("/register", authLimiter, validate(registerSchema), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user and return JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required: [email, password]
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation or request error
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Resource not found
 */
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
