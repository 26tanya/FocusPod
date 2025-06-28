const express = require('express');
const router = express.Router();
const { register, login, verifyOtp } = require('../controllers/authController');
const User = require('../models/User'); 
const { forgotPassword, resetPassword } = require('../controllers/authController');
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// Google login from Firebase (frontend)
router.post('/google-login', async (req, res) => {
  const { name, email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, fromGoogle: true });
      await user.save();
    }

    res.status(200).json({ message: 'User logged in via Google', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
