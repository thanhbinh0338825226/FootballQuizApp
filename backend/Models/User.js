const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId, // ID tự động của MongoDB
        auto: true
    },
    Name: {
        type: String,
        required: true
    },
    DayOfBirth: {
        type: Date,
        required: true
    },
    PhoneNumber: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    ConfirmPassword: {
        type: String,
        required: true
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    ImageUrl: {
        type: String,
        default: ""
    },
    otp: { type: String },   // Mã OTP
    otpExpiresAt: { type: Date }, // Thời gian hết hạn OTP
    otpAttempts: { type: Number, default: 0 }, // Số lần nhập sai OTP
}, { timestamps: true }); // Tự động thêm createdAt & updatedAt

const User = mongoose.model("User", userSchema, "Users");

module.exports = User;
