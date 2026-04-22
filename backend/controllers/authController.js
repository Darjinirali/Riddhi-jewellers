const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../config/nodemailer');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const ADMIN_EMAILS = ['admin0936@gmail.com'];

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    const existing = await User.findOne({ email });
    if (existing && existing.isVerified) return res.status(400).json({ message: 'Email already registered' });
    if (existing && !existing.isVerified) await User.deleteOne({ email });

    const hashed = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashed, phone: phone || '' });

    const otp = generateOTP();
    await OTP.deleteMany({ email, type: 'register' });
    await OTP.create({ email, otp, type: 'register' });
    await sendOTPEmail(email, otp, 'Verify Your Email');

    res.status(201).json({ message: 'OTP sent to your email. Please verify.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/verify-register-otp
exports.verifyRegisterOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await OTP.findOne({ email, otp, type: 'register' });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

    await User.findOneAndUpdate({ email }, { isVerified: true });
    await OTP.deleteMany({ email });

    const user = await User.findOne({ email });

    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    const role = isAdmin ? 'admin' : user.role;

    // ✅ DB mein bhi admin role set karo
    if (isAdmin && user.role !== 'admin') {
      await User.findByIdAndUpdate(user._id, { role: 'admin' });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Email verified! Welcome to Riddhi Jewellers.', token, user: { id: user._id, name: user.name, email: user.email, role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No account found with this email' });
    if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    const role = isAdmin ? 'admin' : user.role;

    // ✅ DB mein bhi admin role update karo
    if (isAdmin && user.role !== 'admin') {
      await User.findByIdAndUpdate(user._id, { role: 'admin' });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    const otp = generateOTP();
    await OTP.deleteMany({ email, type: 'forgot' });
    await OTP.create({ email, otp, type: 'forgot' });
    await sendOTPEmail(email, otp, 'Reset Password OTP');

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/verify-forgot-otp
exports.verifyForgotOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await OTP.findOne({ email, otp, type: 'forgot' });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });
    res.json({ message: 'OTP verified', verified: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = await OTP.findOne({ email, otp, type: 'forgot' });
    if (!record) return res.status(400).json({ message: 'OTP expired or invalid. Please request again.' });

    const hashed = await bcrypt.hash(newPassword, 12);
    await User.findOneAndUpdate({ email }, { password: hashed });
    await OTP.deleteMany({ email });

    res.json({ message: 'Password reset successful! Please login.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/update-profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, address }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};