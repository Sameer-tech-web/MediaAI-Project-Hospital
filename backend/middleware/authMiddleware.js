const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patient');
const {
  getJwtSecret,
  getBootstrapToken,
} = require('../utils/securityConfig');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Not authorized, no token provided',
    });
  }

  const jwtSecret = getJwtSecret();

  if (!jwtSecret) {
    const error = new Error('Server misconfiguration');
    error.statusCode = 500;
    return next(error);
  }

  const token = authHeader.slice('Bearer '.length).trim();

  if (!token) {
    return res.status(401).json({
      message: 'Not authorized, no token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.role === 'patient') {
      const patient = await Patient.findById(decoded.id);
      if (!patient) {
        return res.status(401).json({
          message: 'Not authorized, patient not found',
        });
      }
      req.user = {
        _id: patient._id,
        name: patient.name,
        role: 'patient',
        mrn: patient.mrn,
      };
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'Not authorized, user not found',
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({
        message: 'Not authorized, token failed',
      });
    }

    return next(error);
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Access denied for role ${req.user?.role || 'unknown'}`,
    });
  }

  return next();
};

const bootstrapOrAdmin = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();

    if (userCount === 0) {
      const bootstrapToken = getBootstrapToken();

      if (!bootstrapToken) {
        const error = new Error('Server misconfiguration');
        error.statusCode = 503;
        return next(error);
      }

      if (req.get('x-bootstrap-token') !== bootstrapToken) {
        return res.status(403).json({
          message: 'A valid bootstrap token is required',
        });
      }

      req.isBootstrap = true;
      return next();
    }

    return protect(req, res, (error) => {
      if (error) {
        return next(error);
      }

      if (req.user.role !== 'admin') {
        return res.status(403).json({
          message: 'Only an administrator can create staff accounts',
        });
      }

      return next();
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { protect, authorize, bootstrapOrAdmin };
