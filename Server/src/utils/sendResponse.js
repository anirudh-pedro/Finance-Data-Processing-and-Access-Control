function sendResponse(res, { status = 200, data = null, message } = {}) {
  const payload = {
    success: true,
    data,
  };

  if (message) {
    payload.message = message;
  }

  return res.status(status).json(payload);
}

module.exports = sendResponse;
