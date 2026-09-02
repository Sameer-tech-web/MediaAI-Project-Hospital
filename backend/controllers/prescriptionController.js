const mongoose = require('mongoose');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

const createPrescription = async (req, res, next) => {
  try {
    const { patientId, encounterId, medications } = req.body;

    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const patient = await Patient.findById(patientId).select('_id');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (!Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({ message: 'At least one medication is required' });
    }

    const validTimings = ['After Meal', 'Before Meal', 'SOS'];
    const normalizedMeds = medications.map((med) => {
      if (!med.name || typeof med.name !== 'string' || !med.name.trim()) {
        const error = new Error('Each medication must have a name');
        error.statusCode = 400;
        throw error;
      }

      return {
        name: med.name.trim(),
        formula: typeof med.formula === 'string' ? med.formula.trim() : null,
        dosage: typeof med.dosage === 'string' && med.dosage.trim() ? med.dosage.trim() : '1-0-1',
        timing: validTimings.includes(med.timing) ? med.timing : 'After Meal',
        duration: typeof med.duration === 'string' && med.duration.trim() ? med.duration.trim() : '5 Days',
        instructions: typeof med.instructions === 'string' ? med.instructions.trim() : null,
      };
    });

    const prescriptionData = {
      patient: patientId,
      doctor: req.user._id,
      medications: normalizedMeds,
    };

    if (encounterId && mongoose.isValidObjectId(encounterId)) {
      prescriptionData.encounter = encounterId;
    }

    const prescription = await Prescription.create(prescriptionData);
    await prescription.populate('doctor', 'name email');

    return res.status(201).json(prescription);
  } catch (error) {
    return next(error);
  }
};

const getPrescriptionsByPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate('doctor', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(prescriptions);
  } catch (error) {
    return next(error);
  }
};

const updatePrescriptionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid prescription ID' });
    }

    if (!status || !['Active', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Active, Completed, or Cancelled' });
    }

    const prescription = await Prescription.findById(id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    prescription.status = status;
    await prescription.save();
    await prescription.populate('doctor', 'name email');

    return res.status(200).json(prescription);
  } catch (error) {
    return next(error);
  }
};

module.exports = { createPrescription, getPrescriptionsByPatient, updatePrescriptionStatus };
