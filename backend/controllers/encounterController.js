const mongoose = require('mongoose');
const Encounter = require('../models/Encounter');
const Patient = require('../models/Patient');

const createEncounter = async (req, res, next) => {
  try {
    const { patientId, symptoms, diagnosis, notes, status } = req.body;

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

    const normalizedSymptoms = Array.isArray(symptoms)
      ? symptoms.filter((s) => typeof s === 'string' && s.trim()).map((s) => s.trim())
      : typeof symptoms === 'string' && symptoms.trim()
        ? [symptoms.trim()]
        : [];

    const encounter = await Encounter.create({
      patient: patientId,
      doctor: req.user._id,
      symptoms: normalizedSymptoms,
      diagnosis: typeof diagnosis === 'string' ? diagnosis.trim() : '',
      notes: typeof notes === 'string' ? notes.trim() : '',
      status: status === 'Draft' ? 'Draft' : 'Completed',
    });

    await encounter.populate('doctor', 'name email');

    return res.status(201).json(encounter);
  } catch (error) {
    return next(error);
  }
};

const getEncountersByPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const encounters = await Encounter.find({ patient: patientId })
      .populate('doctor', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(encounters);
  } catch (error) {
    return next(error);
  }
};

const updateEncounterStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid encounter ID' });
    }

    if (!status || !['Draft', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Draft or Completed' });
    }

    const encounter = await Encounter.findById(id);

    if (!encounter) {
      return res.status(404).json({ message: 'Encounter not found' });
    }

    encounter.status = status;
    await encounter.save();
    await encounter.populate('doctor', 'name email');

    return res.status(200).json(encounter);
  } catch (error) {
    return next(error);
  }
};

module.exports = { createEncounter, getEncountersByPatient, updateEncounterStatus };
