const express = require("express");
const financeController = require("./finance.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");
const {
	createRecordSchema,
	updateRecordSchema,
	recordIdParamSchema,
} = require("../../validation/finance.schemas");
const { recordsQuerySchema } = require("../../validation/filter.schemas");

const router = express.Router();

/**
 * @openapi
 * /records:
 *   post:
 *     summary: Create a financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *             required: [amount, type, category, date]
 *     responses:
 *       200:
 *         description: Record created successfully
 *       400:
 *         description: Validation or request error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Resource not found
 */
router.post(
	"/",
	authMiddleware,
	roleMiddleware(["ADMIN"]),
	validate(createRecordSchema),
	financeController.createRecord
);

/**
 * @openapi
 * /records:
 *   get:
 *     summary: Get financial records with filtering and pagination
 *     tags: [Records]
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
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Records fetched successfully
 *       400:
 *         description: Validation or request error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Resource not found
 */
router.get("/", authMiddleware, validate(recordsQuerySchema, "query"), financeController.getRecords);

/**
 * @openapi
 * /records/{id}:
 *   put:
 *     summary: Update a financial record
 *     tags: [Records]
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
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       400:
 *         description: Validation or request error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Record not found
 */
router.put(
	"/:id",
	authMiddleware,
	roleMiddleware(["ADMIN"]),
	validate(recordIdParamSchema, "params"),
	validate(updateRecordSchema),
	financeController.updateRecord
);

/**
 * @openapi
 * /records/{id}:
 *   delete:
 *     summary: Delete a financial record
 *     tags: [Records]
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
 *         description: Record deleted successfully
 *       400:
 *         description: Validation or request error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Record not found
 */
router.delete(
	"/:id",
	authMiddleware,
	roleMiddleware(["ADMIN"]),
	validate(recordIdParamSchema, "params"),
	financeController.deleteRecord
);

module.exports = router;
