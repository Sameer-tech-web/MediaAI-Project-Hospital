const express = require('express');
const { getDoctors } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/doctors', protect, asyncHandler(getDoctors));

module.exports = router;
