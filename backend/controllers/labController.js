const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const LabOrder = require('../models/LabOrder');
const Patient = require('../models/Patient');

const uploadLabReport = async (req, res, next) => {
  try {
    const { patientId, testCategory, testName } = req.body;

    if (!patientId || !testCategory) {
      return res.status(400).json({ message: 'Patient ID and test category are required' });
    }

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const patient = await Patient.findById(patientId).select('_id');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const labOrder = await LabOrder.create({
      patient: patientId,
      doctor: req.user._id,
      tests: [
        {
          name: testName || testCategory,
          category: testCategory,
          status: 'Completed',
          resultFile: {
            fileName: req.file.originalname,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            url: fileUrl,
            storageKey: req.file.filename,
            uploadedBy: req.user._id,
          },
        },
      ],
      status: 'Completed',
    });

    await labOrder.populate('doctor', 'name email');

    return res.status(201).json(labOrder);
  } catch (error) {
    return next(error);
  }
};

const getLabOrdersByPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const labOrders = await LabOrder.find({ patient: patientId })
      .populate('doctor', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(labOrders);
  } catch (error) {
    return next(error);
  }
};

const getLabReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }

    const labOrder = await LabOrder.findById(id).lean();

    if (!labOrder || !labOrder.tests || labOrder.tests.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const test = labOrder.tests.find((t) => t.resultFile);

    if (!test) {
      return res.status(404).json({ message: 'No file attached to this report' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', test.resultFile.storageKey || test.resultFile.url.replace('/uploads/', ''));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    return res.sendFile(filePath);
  } catch (error) {
    return next(error);
  }
};

const deleteLabReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }

    const labOrder = await LabOrder.findById(id);

    if (!labOrder) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (labOrder.tests && labOrder.tests.length > 0) {
      for (const test of labOrder.tests) {
        if (test.resultFile && test.resultFile.storageKey) {
          const filePath = path.join(__dirname, '..', 'uploads', test.resultFile.storageKey);

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    }

    await labOrder.deleteOne();

    return res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { uploadLabReport, getLabOrdersByPatient, getLabReport, deleteLabReport };
