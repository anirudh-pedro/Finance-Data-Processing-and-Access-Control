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

/**
 * @openapi
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard summary totals
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Summary fetched successfully
 *       400:
 *         description: Validation or request error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Resource not found
 */
router.get("/summary", validate(dashboardDateFilterSchema, "query"), dashboardController.getSummary);

/**
 * @openapi
 * /dashboard/categories:
 *   get:
 *     summary: Get category-wise analytics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Category analytics fetched successfully
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
	"/categories",
	validate(dashboardDateFilterSchema, "query"),
	dashboardController.getCategories
);

/**
 * @openapi
 * /dashboard/trends:
 *   get:
 *     summary: Get time-based income and expense trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Trends fetched successfully
 *       400:
 *         description: Validation or request error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Resource not found
 */
router.get("/trends", validate(dashboardDateFilterSchema, "query"), dashboardController.getTrends);

/**
 * @openapi
 * /dashboard/recent:
 *   get:
 *     summary: Get recent financial records for dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recent records fetched successfully
 *       400:
 *         description: Validation or request error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Resource not found
 */
router.get("/recent", validate(dashboardRecentQuerySchema, "query"), dashboardController.getRecent);

module.exports = router;
