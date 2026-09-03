const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  mrn: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  contactNumber: { type: String },
  email: { type: String },
  address: { type: String },
  bloodGroup: { type: String },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedNurse: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ward: { type: String },
  bedNumber: { type: String },
  status: { type: String, enum: ['Admitted', 'Discharged', 'Critical', 'Stable'], default: 'Admitted' },
  medicalHistory: [{ type: String }],
  allergies: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
