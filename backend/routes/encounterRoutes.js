const express = require('express');
const {
  createEncounter,
  getEncountersByPatient,
  updateEncounterStatus,
} = require('../controllers/encounterController');
const { protect, authorize } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('doctor', 'admin'),
  asyncHandler(createEncounter)
);

router.get(
  '/patient/:patientId',
  protect,
  asyncHandler(getEncountersByPatient)
);

router.patch(
  '/:id',
  protect,
  authorize('doctor', 'admin'),
  asyncHandler(updateEncounterStatus)
);

module.exports = router;
