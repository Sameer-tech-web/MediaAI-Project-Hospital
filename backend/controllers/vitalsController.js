const mongoose = require('mongoose');
const Vitals = require('../models/Vitals');
const Patient = require('../models/Patient');

const recordVitals = async (req, res, next) => {
  try {
    const {
      patientId,
      heartRate,
      systolic,
      diastolic,
      spo2,
      temperature,
      respiratoryRate,
    } = req.body;

    if (
      !patientId ||
      heartRate === undefined ||
      systolic === undefined ||
      diastolic === undefined ||
      spo2 === undefined ||
      temperature === undefined ||
      respiratoryRate === undefined
    ) {
      return res.status(400).json({
        message: 'All vital signs and patient ID are required',
      });
    }

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const numericValues = [
      heartRate,
      systolic,
      diastolic,
      spo2,
      temperature,
      respiratoryRate,
    ];

    if (numericValues.some((value) => !Number.isFinite(Number(value)))) {
      return res.status(400).json({
        message: 'All vital signs must be valid numbers',
      });
    }

    const numericHeartRate = Number(heartRate);
    const numericSystolic = Number(systolic);
    const numericDiastolic = Number(diastolic);
    const numericSpo2 = Number(spo2);
    const numericTemperature = Number(temperature);
    const numericRespiratoryRate = Number(respiratoryRate);

    if (numericHeartRate < 0) {
      return res.status(400).json({ message: 'Heart rate cannot be negative' });
    }

    if (numericSystolic < 0 || numericDiastolic < 0) {
      return res.status(400).json({
        message: 'Blood pressure values cannot be negative',
      });
    }

    if (numericSpo2 < 0 || numericSpo2 > 100) {
      return res.status(400).json({ message: 'SpO2 must be between 0 and 100' });
    }

    if (numericRespiratoryRate < 0) {
      return res.status(400).json({
        message: 'Respiratory rate cannot be negative',
      });
    }

    if (numericTemperature < 0) {
      return res.status(400).json({ message: 'Temperature cannot be negative' });
    }

    if (numericSystolic <= numericDiastolic) {
      return res.status(400).json({
        message: 'Systolic blood pressure must be greater than diastolic pressure',
      });
    }

    const patient = await Patient.findById(patientId).select('_id');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    let alertStatus = 'Normal';

    const isCritical =
      numericHeartRate > 120 ||
      numericHeartRate < 50 ||
      numericSpo2 < 90 ||
      numericTemperature > 39 ||
      numericSystolic >= 180 ||
      numericDiastolic >= 120 ||
      numericRespiratoryRate > 30 ||
      numericRespiratoryRate < 8;

    const isWarning =
      numericHeartRate > 100 ||
      numericHeartRate < 60 ||
      numericSpo2 < 95 ||
      numericTemperature > 38 ||
      numericSystolic >= 140 ||
      numericDiastolic >= 90 ||
      numericRespiratoryRate > 20 ||
      numericRespiratoryRate < 12;

    if (isCritical) {
      alertStatus = 'Critical';
    } else if (isWarning) {
      alertStatus = 'Warning';
    }

    const vitals = await Vitals.create({
      patient: patientId,
      recordedBy: req.user._id,
      heartRate: numericHeartRate,
      bloodPressure: {
        systolic: numericSystolic,
        diastolic: numericDiastolic,
      },
      spo2: numericSpo2,
      temperature: numericTemperature,
      respiratoryRate: numericRespiratoryRate,
      alertStatus,
    });

    return res.status(201).json(vitals);
  } catch (error) {
    return next(error);
  }
};

const getPatientVitals = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const patient = await Patient.findById(patientId).select('_id');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const vitals = await Vitals.find({ patient: patientId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(vitals);
  } catch (error) {
    return next(error);
  }
};

const getLatestVitals = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const patient = await Patient.findById(patientId).select('_id');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const vitals = await Vitals.findOne({ patient: patientId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(vitals || {});
  } catch (error) {
    return next(error);
  }
};

module.exports = { recordVitals, getPatientVitals, getLatestVitals };
