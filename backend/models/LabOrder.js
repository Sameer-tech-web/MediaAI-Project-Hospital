const mongoose = require('mongoose');

const labOrderSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testName: { type: String, required: true },
  category: { type: String },
  status: { type: String, enum: ['Pending', 'In-Progress', 'Completed', 'Cancelled'], default: 'Pending' },
  result: { type: String },
  remarks: { type: String },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('LabOrder', labOrderSchema);
