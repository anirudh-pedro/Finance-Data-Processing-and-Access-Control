const express = require("express");
const dashboardController = require("./dashboard.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");
const {
	dashboardDateFilterSchema,
	dashboardRecentQuerySchema,
} = require("../../validation/filter.schemas");

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(["ADMIN", "ANALYST"]));

router.get("/summary", validate(dashboardDateFilterSchema, "query"), dashboardController.getSummary);
router.get(
	"/categories",
	validate(dashboardDateFilterSchema, "query"),
	dashboardController.getCategories
);
router.get("/trends", validate(dashboardDateFilterSchema, "query"), dashboardController.getTrends);
router.get("/recent", validate(dashboardRecentQuerySchema, "query"), dashboardController.getRecent);

module.exports = router;
