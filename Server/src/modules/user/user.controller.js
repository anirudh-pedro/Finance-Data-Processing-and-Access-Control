const userService = require("./user.service");
const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/sendResponse");

const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.getUsers(req.query);

  return sendResponse(res, {
    status: 200,
    data: result,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body, req.user);

  return sendResponse(res, {
    status: 200,
    message: "User updated successfully",
    data: user,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id, req.user);

  return sendResponse(res, {
    status: 200,
    data: user,
  });
});

module.exports = {
  getUsers,
  updateUser,
  getUserById,
};
