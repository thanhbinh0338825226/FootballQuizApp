const nodemailer = require('nodemailer');
require('dotenv').config();  // Nạp các biến môi trường từ file .env

// Tạo transporter (kết nối với email của bạn)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Hoặc có thể dùng dịch vụ gửi email khác
    auth: {
        user: process.env.EMAIL_USER, // Đọc thông tin email từ biến môi trường
        pass: process.env.EMAIL_PASS,  // Đọc mật khẩu từ biến môi trường
    }
});

// Hàm gửi email
const sendOtpEmail = (recipient, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Địa chỉ gửi email
        to: recipient, // Địa chỉ nhận email
        subject: 'Mã OTP xác thực', // Tiêu đề email
        text: `Mã OTP của bạn là: ${otp}`, // Nội dung email chứa mã OTP
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Lỗi khi gửi email: ', error);
        } else {
            console.log('Email đã được gửi: ' + info.response);
        }
    });
};

module.exports = { sendOtpEmail };
