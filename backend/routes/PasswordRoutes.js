const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// Route to handle sending OTP
router.post('/forgot', passwordController.forgotPassword);

// Route to handle verifying OTP and updating password
router.post('/verify', passwordController.verifyOtp);

module.exports = router;
