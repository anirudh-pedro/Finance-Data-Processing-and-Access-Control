const express = require("express");
const userController = require("./user.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");
const {
  userListQuerySchema,
  userIdParamSchema,
  userUpdateSchema,
} = require("../../validation/user.schemas");

const router = express.Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get paginated users list
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       400:
 *         description: Validation or request error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Resource not found
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(userListQuerySchema, "query"),
  userController.getUsers
);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Update user role or status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, ANALYST, VIEWER]
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation or request error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(userIdParamSchema, "params"),
  validate(userUpdateSchema),
  userController.updateUser
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       400:
 *         description: Validation or request error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  authMiddleware,
  validate(userIdParamSchema, "params"),
  userController.getUserById
);

module.exports = router;
