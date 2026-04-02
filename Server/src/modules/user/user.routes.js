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

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(userListQuerySchema, "query"),
  userController.getUsers
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(userIdParamSchema, "params"),
  validate(userUpdateSchema),
  userController.updateUser
);

router.get(
  "/:id",
  authMiddleware,
  validate(userIdParamSchema, "params"),
  userController.getUserById
);

module.exports = router;
