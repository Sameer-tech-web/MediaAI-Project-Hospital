const mongoose = require('mongoose');
const User = require('../models/User');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\]/g, '\$&');

const resolveAssignedDoctor = async (value) => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return null;
  }

  const candidate = String(value).trim();

  if (mongoose.isValidObjectId(candidate)) {
    const doctor = await User.findOne({
      _id: candidate,
      role: 'doctor',
    }).select('_id');

    if (!doctor) {
      const error = new Error('Assigned doctor not found');
      error.statusCode = 400;
      throw error;
    }

    return doctor._id;
  }

  const withoutTitle = candidate.replace(/^dr\.?\s+/i, '').trim();
  const names = [...new Set([candidate, withoutTitle].filter(Boolean))];
  const doctor = await User.findOne({
    role: 'doctor',
    $or: names.map((name) => ({
      name: new RegExp(`^${escapeRegex(name)}$`, 'i'),
    })),
  }).select('_id');

  if (!doctor) {
    const error = new Error('Assigned doctor not found');
    error.statusCode = 400;
    throw error;
  }

  return doctor._id;
};

module.exports = { resolveAssignedDoctor };
