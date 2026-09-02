const express = require('express');
const {
  createPrescription,
  getPrescriptionsByPatient,
  updatePrescriptionStatus,
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('doctor', 'admin'),
  asyncHandler(createPrescription)
);

router.get(
  '/patient/:patientId',
  protect,
  asyncHandler(getPrescriptionsByPatient)
);

router.patch(
  '/:id',
  protect,
  authorize('doctor', 'admin'),
  asyncHandler(updatePrescriptionStatus)
);

module.exports = router;
