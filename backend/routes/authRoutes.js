const express = require('express');
const {
  registerUser,
  loginUser,
  patientLogin,
  getMe,
} = require('../controllers/authController');
const { protect, bootstrapOrAdmin } = require('../middleware/authMiddleware');
const { limitLoginAttempts } = require('../middleware/rateLimiter');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/login', limitLoginAttempts, asyncHandler(loginUser));
router.post('/register', bootstrapOrAdmin, asyncHandler(registerUser));
router.post('/patient-login', limitLoginAttempts, asyncHandler(patientLogin));
router.get('/me', protect, asyncHandler(getMe));

module.exports = router;
