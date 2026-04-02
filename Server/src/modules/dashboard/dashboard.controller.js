const dashboardService = require("./dashboard.service");
const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/sendResponse");

const getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getSummary(req.query, req.user);
  return sendResponse(res, {
    status: 200,
    data: summary,
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await dashboardService.getCategorySummary(req.query, req.user);
  return sendResponse(res, {
    status: 200,
    data: categories,
  });
});

const getTrends = asyncHandler(async (req, res) => {
  const trends = await dashboardService.getMonthlyTrends(req.query, req.user);
  return sendResponse(res, {
    status: 200,
    data: trends,
  });
});

const getRecent = asyncHandler(async (req, res) => {
  const records = await dashboardService.getRecentActivity(req.query, req.user);
  return sendResponse(res, {
    status: 200,
    data: records,
  });
});

module.exports = {
  getSummary,
  getCategories,
  getTrends,
  getRecent,
};
