const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patient');
const { getJwtSecret } = require('../utils/securityConfig');

const normalizeRole = (role) => {
  if (typeof role !== 'string') {
    return null;
  }

  const normalizedRole = role.trim().toLowerCase().replace(/\s+/g, '_');
  const validRoles = User.schema.path('role').enumValues;

  return validRoles.includes(normalizedRole) ? normalizedRole : null;
};

const generateToken = (id) => {
  const jwtSecret = getJwtSecret();

  if (!jwtSecret) {
    const error = new Error('Server misconfiguration');
    error.statusCode = 500;
    throw error;
  }

  return jwt.sign({ id }, jwtSecret, { expiresIn: '7d' });
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: 'Name, email, and password are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail }).select('_id');

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const requestedRole =
      role === undefined || role === null || role === ''
        ? 'doctor'
        : normalizeRole(role);

    if (!requestedRole) {
      return res.status(400).json({ message: 'Invalid staff role' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: req.isBootstrap ? 'admin' : requestedRole,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const roleHint = normalizeRole(role);

    if (roleHint && roleHint !== user.role) {
      return res.status(403).json({
        message: `This account is registered as ${user.role}. Please select the correct role.`,
      });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    return next(error);
  }
};

const patientLogin = async (req, res, next) => {
  try {
    const { mrn, cnic } = req.body;

    if (typeof mrn !== 'string' || !mrn.trim()) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    if (typeof cnic !== 'string' || !cnic.trim()) {
      return res.status(400).json({ message: 'CNIC or contact number is required' });
    }

    const patient = await Patient.findOne({ mrn: mrn.trim().toUpperCase() });

    if (!patient) {
      return res.status(401).json({ message: 'Invalid patient credentials' });
    }

    if (patient.cnic && patient.cnic.trim()) {
      if (patient.cnic.trim() !== cnic.trim()) {
        return res.status(401).json({ message: 'Invalid patient credentials' });
      }
    } else if (patient.contact && patient.contact.trim()) {
      if (patient.contact.trim() !== cnic.trim()) {
        return res.status(401).json({ message: 'Invalid patient credentials' });
      }
    }

    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      const error = new Error('Server misconfiguration');
      error.statusCode = 500;
      throw error;
    }

    const token = jwt.sign({ id: patient._id, role: 'patient' }, jwtSecret, { expiresIn: '7d' });

    return res.status(200).json({
      token,
      patient: {
        _id: patient._id,
        mrn: patient.mrn,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        contact: patient.contact,
        bloodGroup: patient.bloodGroup,
        department: patient.department,
      },
      role: 'patient',
    });
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    if (req.user.role === 'patient') {
      return res.status(200).json({ user: req.user });
    }

    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};

module.exports = { registerUser, loginUser, patientLogin, getMe };
