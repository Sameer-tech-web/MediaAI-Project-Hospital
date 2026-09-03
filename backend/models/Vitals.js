const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  heartRate: { type: Number, required: true },
  bloodPressureSys: { type: Number, required: true },
  bloodPressureDia: { type: Number, required: true },
  temperature: { type: Number, required: true },
  oxygenSaturation: { type: Number, required: true },
  respiratoryRate: { type: Number },
  consciousness: { type: String, enum: ['Alert', 'Voice', 'Pain', 'Unresponsive'], default: 'Alert' },
  notes: { type: String },
  status: { type: String, enum: ['Normal', 'Warning', 'Critical'], default: 'Normal' }
}, { timestamps: true });

module.exports = mongoose.model('Vitals', vitalsSchema);
