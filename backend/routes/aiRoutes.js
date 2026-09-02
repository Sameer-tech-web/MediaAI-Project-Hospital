const express = require('express');
const { chatWithAssistant } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
const REQUEST_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const requestWindows = new Map();

const limitAiRequests = (req, res, next) => {
  const now = Date.now();

  for (const [userId, requestWindow] of requestWindows) {
    if (requestWindow.expiresAt <= now) {
      requestWindows.delete(userId);
    }
  }

  const userId = req.user._id.toString();
  const requestWindow = requestWindows.get(userId);

  if (requestWindow) {
    if (requestWindow.count >= MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({
        message: 'AI request limit reached. Please try again shortly.',
      });
    }

    requestWindow.count += 1;
  } else {
    requestWindows.set(userId, {
      count: 1,
      expiresAt: now + REQUEST_WINDOW_MS,
    });
  }

  return next();
};

router.post(
  '/chat',
  protect,
  authorize('admin', 'doctor', 'nurse'),
  limitAiRequests,
  asyncHandler(chatWithAssistant)
);

module.exports = router;
