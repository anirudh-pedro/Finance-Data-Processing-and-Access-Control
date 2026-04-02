const financeService = require("./finance.service");
const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/sendResponse");

const createRecord = asyncHandler(async (req, res) => {
  const record = await financeService.createRecord(req.body, req.user);
  return sendResponse(res, {
    status: 201,
    message: "Record created successfully",
    data: record,
  });
});

const getRecords = asyncHandler(async (req, res) => {
  const result = await financeService.getRecords(req.query, req.user);
  return sendResponse(res, {
    status: 200,
    data: result,
  });
});

const updateRecord = asyncHandler(async (req, res) => {
  const record = await financeService.updateRecord(req.params.id, req.body);
  return sendResponse(res, {
    status: 200,
    message: "Record updated successfully",
    data: record,
  });
});

const deleteRecord = asyncHandler(async (req, res) => {
  await financeService.deleteRecord(req.params.id);
  return sendResponse(res, {
    status: 200,
    message: "Record deleted successfully",
    data: null,
  });
});

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
};
