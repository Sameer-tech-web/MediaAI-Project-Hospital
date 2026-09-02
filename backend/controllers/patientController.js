const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const { generateMRN } = require('../utils/mrn');
const { resolveAssignedDoctor } = require('../utils/resolveDoctor');

const PATIENT_POPULATION = 'name email role';
const editableStringFields = [
  'name',
  'gender',
  'contact',
  'cnic',
  'department',
  'bloodGroup',
  'triageCategory',
  'symptoms',
  'queueStatus',
];
const nullableStringFields = new Set(['cnic', 'department', 'bloodGroup']);

const hasOwn = (object, key) =>
  Object.prototype.hasOwnProperty.call(object, key);

const parseAge = (age) => {
  const parsedAge = Number(age);

  return Number.isFinite(parsedAge) && parsedAge >= 0 && parsedAge <= 130
    ? parsedAge
    : null;
};

const createPatient = async (attributes) => {
  let lastError;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const patient = await Patient.create({
        ...attributes,
        mrn: await generateMRN(),
      });

      await patient.populate('assignedDoctor', PATIENT_POPULATION);
      return patient;
    } catch (error) {
      const isMrnConflict =
        error.code === 11000 &&
        (error.keyPattern?.mrn || error.keyValue?.mrn);

      if (!isMrnConflict) {
        throw error;
      }

      lastError = error;
    }
  }

  const error = new Error(
    'A patient with this MRN already exists. Please try again.'
  );
  error.statusCode = 409;
  error.cause = lastError;
  throw error;
};

const registerPatient = async (req, res, next) => {
  try {
    const {
      name,
      age,
      gender,
      cnic,
      contact,
      department,
      bloodGroup,
      triageCategory,
      symptoms,
      assignedDoctor,
      bedNumber,
    } = req.body;

    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedGender = typeof gender === 'string' ? gender.trim() : '';
    const normalizedContact = typeof contact === 'string' ? contact.trim() : '';
    const normalizedSymptoms = typeof symptoms === 'string' ? symptoms.trim() : '';
    const numericAge = parseAge(age);

    if (
      !normalizedName ||
      numericAge === null ||
      !normalizedGender ||
      !normalizedContact ||
      !normalizedSymptoms
    ) {
      return res.status(400).json({
        message: 'Name, a valid age, gender, contact, and symptoms are required',
      });
    }

    const patient = await createPatient({
      name: normalizedName,
      age: numericAge,
      gender: normalizedGender,
      cnic: typeof cnic === 'string' && cnic.trim() ? cnic.trim() : null,
      contact: normalizedContact,
      department:
        typeof department === 'string' && department.trim()
          ? department.trim()
          : null,
      bloodGroup:
        typeof bloodGroup === 'string' && bloodGroup.trim()
          ? bloodGroup.trim()
          : null,
      triageCategory,
      symptoms: normalizedSymptoms,
      assignedDoctor: await resolveAssignedDoctor(assignedDoctor),
      bedNumber:
        typeof bedNumber === 'string' && bedNumber.trim()
          ? bedNumber.trim()
          : null,
    });

    return res.status(201).json(patient);
  } catch (error) {
    return next(error);
  }
};

const getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find()
      .populate('assignedDoctor', PATIENT_POPULATION)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(patients);
  } catch (error) {
    return next(error);
  }
};

const getPatientById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const patient = await Patient.findById(req.params.id)
      .populate('assignedDoctor', PATIENT_POPULATION)
      .lean();

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.status(200).json(patient);
  } catch (error) {
    return next(error);
  }
};

const updatePatientStatus = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (hasOwn(req.body, 'age')) {
      const numericAge = parseAge(req.body.age);

      if (numericAge === null) {
        return res.status(400).json({ message: 'Age must be between 0 and 130' });
      }

      patient.age = numericAge;
    }

    for (const field of editableStringFields) {
      if (!hasOwn(req.body, field)) {
        continue;
      }

      const value = req.body[field];

      if (value === null && nullableStringFields.has(field)) {
        patient[field] = null;
        continue;
      }

      if (typeof value !== 'string' || !value.trim()) {
        return res.status(400).json({ message: `${field} must be a non-empty string` });
      }

      patient[field] = value.trim();
    }

    if (hasOwn(req.body, 'assignedDoctor')) {
      patient.assignedDoctor = await resolveAssignedDoctor(req.body.assignedDoctor);
    }

    if (hasOwn(req.body, 'bedNumber')) {
      const { bedNumber } = req.body;

      if (bedNumber !== null && typeof bedNumber !== 'string') {
        return res.status(400).json({ message: 'bedNumber must be a string or null' });
      }

      patient.bedNumber = bedNumber?.trim() || null;
    }

    await patient.save();
    await patient.populate('assignedDoctor', PATIENT_POPULATION);

    return res.status(200).json(patient);
  } catch (error) {
    return next(error);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await patient.deleteOne();

    return res.status(200).json({ message: 'Patient removed successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerPatient,
  getPatients,
  getPatientById,
  updatePatientStatus,
  deletePatient,
};
