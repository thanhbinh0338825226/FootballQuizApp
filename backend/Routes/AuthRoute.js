const express = require('express');
const router = express.Router();
const { verifyOtp , sendOtp, resendOtp} = require('../Controller/AuthController'); // Đảm bảo đường dẫn đúng đến controller

// Route xác thực OTP
router.post('/verify-otp', verifyOtp);
router.post('/send-otp', sendOtp);
router.post('/resend-otp', resendOtp);
module.exports = router;
