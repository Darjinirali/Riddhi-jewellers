const router = require('express').Router();
const { register, verifyRegisterOTP, login, forgotPassword, verifyForgotOTP, resetPassword, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/verify-register-otp', verifyRegisterOTP);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-forgot-otp', verifyForgotOTP);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
