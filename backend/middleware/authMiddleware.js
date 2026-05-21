const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  console.log('Auth Middleware: Request URL:', req.url);
  console.log('Auth Middleware: Headers:', req.headers);
  
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Auth Middleware: Found token:', token.substring(0, 20) + '...');
  } else {
    console.log('Auth Middleware: No Authorization header or not Bearer');
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware: Decoded token:', decoded);
    req.admin = await Admin.findById(decoded.id).select('-password');

    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Admin not found.' });
    }

    console.log('Auth Middleware: Admin found, proceeding');
    next();
  } catch (error) {
    console.log('Auth Middleware: Error verifying token:', error);
    return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
  }
};

module.exports = { protect };
