const express = require('express');
const {
  registerPatient,
  getPatients,
  getPatientById,
  updatePatientStatus,
  deletePatient,
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
const admissionRoles = ['admin', 'receptionist', 'nurse', 'doctor'];

router
  .route('/')
  .get(protect, asyncHandler(getPatients))
  .post(
    protect,
    authorize(...admissionRoles),
    asyncHandler(registerPatient)
  );

router
  .route('/:id')
  .get(protect, asyncHandler(getPatientById))
  .patch(
    protect,
    authorize(...admissionRoles),
    asyncHandler(updatePatientStatus)
  )
  .put(
    protect,
    authorize(...admissionRoles),
    asyncHandler(updatePatientStatus)
  )
  .delete(protect, authorize('admin'), asyncHandler(deletePatient));

module.exports = router;
