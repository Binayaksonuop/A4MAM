const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }

  try {
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// @desc    Get current admin profile
// @route   GET /api/admin/me
// @access  Private
const getAdminProfile = async (req, res) => {
  res.status(200).json({ success: true, admin: req.admin });
};

// @desc    Verify admin token
// @route   GET /api/admin/verify
// @access  Private
const verifyAdminToken = async (req, res) => {
  res.status(200).json({ success: true });
};

module.exports = { adminLogin, getAdminProfile, verifyAdminToken };
