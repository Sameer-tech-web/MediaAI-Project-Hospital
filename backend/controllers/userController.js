const User = require('../models/User');

const getDoctors = async (req, res, next) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('name email role')
      .sort({ name: 1 })
      .lean();

    return res.status(200).json(doctors);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getDoctors };
