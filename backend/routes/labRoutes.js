const express = require('express');
const {
  uploadLabReport,
  getLabOrdersByPatient,
  getLabReport,
  deleteLabReport,
} = require('../controllers/labController');
const { protect, authorize } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const upload = require('../middleware/upload');

const router = express.Router();

router.post(
  '/upload',
  protect,
  authorize('doctor', 'admin', 'lab_technician'),
  upload.single('file'),
  asyncHandler(uploadLabReport)
);

router.get(
  '/patient/:patientId',
  protect,
  asyncHandler(getLabOrdersByPatient)
);

router.get(
  '/report/:id',
  protect,
  asyncHandler(getLabReport)
);

router.delete(
  '/report/:id',
  protect,
  authorize('admin'),
  asyncHandler(deleteLabReport)
);

module.exports = router;
