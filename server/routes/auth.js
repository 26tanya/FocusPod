const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyOtp,
  forgotPassword,
  resetPassword,
  updateName,
  changePassword,
  updateProfile
} = require('../controllers/authController');
const User = require('../models/User');

// 🔐 REGISTER, LOGIN, OTP
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);

// 🔁 PASSWORD RESET FLOW
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// 👤 PROFILE EDIT
router.put('/profile/:userId', updateProfile);
router.put('/change-password', changePassword);

// 🔐 GOOGLE LOGIN (via Firebase token decoded in frontend)
router.post('/google-login', async (req, res) => {
  const { name, email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, fromGoogle: true, isVerified: true });
      await user.save();
    }

    console.log("🔍 Google login user:", user);
    res.status(200).json({
      message: 'User logged in via Google',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        fromGoogle: user.fromGoogle
      }
    });

  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
