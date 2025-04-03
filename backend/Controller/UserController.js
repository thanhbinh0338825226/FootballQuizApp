const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const { verifyOtp } = require('../Controller/AuthController');  // Import verifyOtp từ authController
const { sendOtpEmail } = require('../Services/Mailer');
const cloudinary = require('../config/cloudinaryConfig'); 
const upload = require('../middleware/upload');
const moment = require("moment");

// const registerUser = async (req, res) => {
//     try {
//         const { Name, Email, Password, ConfirmPassword, PhoneNumber, DayOfBirth } = req.body;

//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
//             return res.status(400).json({ error: "Invalid email format!" });
//         }

//         if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(Password)) {
//             return res.status(400).json({ 
//                 error: "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character!" 
//             });
//         }

//         const existingUser = await User.findOne({ Email });
//         if (existingUser) {
//             return res.status(400).json({ error: "Email đã được sử dụng!" });
//         }
//         if (Password !== ConfirmPassword) {
//             return res.status(400).json({ error: "Passwords do not match!" });
//         }

//         const hashedPassword = await bcrypt.hash(Password, 10);

//         // Kiểm tra nếu có ảnh thì upload lên Cloudinary
//         let imageUrl = "";
//         if (req.file) {
//             // console.log("File nhận được:", req.file);
//             const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//                 folder: "users",
//                 use_filename: true,
//                 unique_filename: false,
//             });
//             // console.log(uploadResult);
//             imageUrl = uploadResult.secure_url;
//         }

//         // Kiểm tra format ngày sinh
//         const formattedDate = moment(DayOfBirth, ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"], true);
//         if (!formattedDate.isValid()) {
//             return res.status(400).json({ error: "Invalid date format! Use YYYY-MM-DD or DD-MM-YYYY or DD/MM/YYYY." });
//         }

//         const newUser = new User({
//             Name,
//             Email,
//             PhoneNumber,
//             DayOfBirth: formattedDate.toDate(),
//             ImageUrl: imageUrl,
//             Password: hashedPassword,
//             ConfirmPassword: hashedPassword,
//             isVerify: false,
//         });

//         await newUser.save();
//         return res.status(201).json({
//             message: "Đăng ký thành công!",
//             user: newUser
//         });
        
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ params

        // Tìm và xóa người dùng theo ID
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found!" });
        }

        return res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { Name, Email, Password, ConfirmPassword, PhoneNumber, DayOfBirth } = req.body;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
            return res.status(400).json({ error: "Invalid email format!" });
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(Password)) {
            return res.status(400).json({ 
                error: "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character!" 
            });
        }

        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ error: "Email đã được sử dụng!" });
        }
        if (Password !== ConfirmPassword) {
            return res.status(400).json({ error: "Passwords do not match!" });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        // Kiểm tra nếu có ảnh thì upload lên Cloudinary
        let imageUrl = "";
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "users",
                use_filename: true,
                unique_filename: false,
            });
            imageUrl = uploadResult.secure_url;
        }

        // Kiểm tra format ngày sinh
        const formattedDate = moment(DayOfBirth, ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"], true);
        if (!formattedDate.isValid()) {
            return res.status(400).json({ error: "Invalid date format! Use YYYY-MM-DD or DD-MM-YYYY or DD/MM/YYYY." });
        }

        // Tạo mã OTP ngẫu nhiên và thời gian hết hạn
        const otp = Math.floor(100000 + Math.random() * 900000); // Tạo mã OTP 6 chữ số
        const otpExpiresAt = new Date();
        otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10); // OTP hết hạn sau 10 phút

        const newUser = new User({
            Name,
            Email,
            PhoneNumber,
            DayOfBirth: formattedDate.toDate(),
            ImageUrl: imageUrl,
            Password: hashedPassword,
            ConfirmPassword: hashedPassword,
            isVerify: false,
            otp, // Lưu OTP vào cơ sở dữ liệu
            otpExpiresAt, // Lưu thời gian hết hạn OTP
            otpAttempts: 0 // Số lần thử nhập OTP
        });

        await newUser.save();

        // Gửi OTP qua email
        sendOtpEmail(Email, otp);

        return res.status(201).json({
            message: "Đăng ký thành công! Mã OTP đã được gửi vào email.",
            user: newUser
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




module.exports = { registerUser, deleteUser };
