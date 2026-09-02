const express = require('express');
const {
  recordVitals,
  getPatientVitals,
  getLatestVitals,
} = require('../controllers/vitalsController');
const { protect, authorize } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('admin', 'doctor', 'nurse'),
  asyncHandler(recordVitals)
);
router.get('/:patientId/latest', protect, asyncHandler(getLatestVitals));
router.get('/:patientId', protect, asyncHandler(getPatientVitals));

module.exports = router;
