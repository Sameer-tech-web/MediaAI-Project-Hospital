const Patient = require('../models/Patient');
const User = require('../models/User');
const Vitals = require('../models/Vitals');

const getDashboardStats = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalPatients,
      todayPatients,
      doctorsAvailable,
      criticalPatients,
      admittedPatients,
      waitingPatients,
      criticalVitalsToday,
    ] = await Promise.all([
      Patient.countDocuments(),
      Patient.countDocuments({ createdAt: { $gte: startOfToday } }),
      User.countDocuments({ role: 'doctor' }),
      Patient.countDocuments({ triageCategory: 'Emergency' }),
      Patient.countDocuments({ queueStatus: 'Admitted' }),
      Patient.countDocuments({ queueStatus: 'Waiting' }),
      Vitals.countDocuments({
        alertStatus: 'Critical',
        createdAt: { $gte: startOfToday },
      }),
    ]);

    return res.status(200).json({
      totalPatients,
      todayPatients,
      doctorsAvailable,
      todayAppointments: 0,
      criticalPatients,
      pendingReports: 0,
      admittedPatients,
      waitingPatients,
      criticalVitalsToday,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getDashboardStats };
