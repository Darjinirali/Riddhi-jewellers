const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    // ✅ Token wala role use karo, DB wala nahi
    req.user = { ...user.toObject(), role: decoded.role };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access only' });
  next();
};