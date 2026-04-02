const authService = require("./auth.service");
const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/sendResponse");

const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  return sendResponse(res, {
    status: 201,
    message: "User registered successfully",
    data: user,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  return sendResponse(res, {
    status: 200,
    message: "Login successful",
    data: result,
  });
});

module.exports = {
  register,
  login,
};
