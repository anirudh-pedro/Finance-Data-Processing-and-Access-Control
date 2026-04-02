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

router.post(
	"/",
	authMiddleware,
	roleMiddleware(["ADMIN"]),
	validate(createRecordSchema),
	financeController.createRecord
);
router.get("/", authMiddleware, validate(recordsQuerySchema, "query"), financeController.getRecords);
router.put(
	"/:id",
	authMiddleware,
	roleMiddleware(["ADMIN"]),
	validate(recordIdParamSchema, "params"),
	validate(updateRecordSchema),
	financeController.updateRecord
);
router.delete(
	"/:id",
	authMiddleware,
	roleMiddleware(["ADMIN"]),
	validate(recordIdParamSchema, "params"),
	financeController.deleteRecord
);

module.exports = router;
