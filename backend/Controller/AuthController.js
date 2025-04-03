const { sendOtpEmail } = require('../Services/Mailer'); // Đảm bảo đường dẫn đúng đến file mailer
const crypto = require('crypto'); // Dùng để tạo mã OTP ngẫu nhiên
const User = require("../Models/User"); // Đảm bảo bạn import đúng model người dùng

// API gửi OTP qua email
const sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const user = await User.findOne({ Email: email.toLowerCase() });


        if (!user) {
            return res.status(400).json({ message: 'Người dùng không tồn tại' });
        }

        // Tạo mã OTP ngẫu nhiên
        const otp = crypto.randomInt(100000, 999999); // Mã OTP là 6 chữ số

        // Gửi OTP qua email
        sendOtpEmail(email, otp);

        // Lưu OTP vào cơ sở dữ liệu với thời gian hết hạn (10 phút)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP hết hạn sau 10 phút

        // Cập nhật OTP và thời gian hết hạn vào bảng User
        user.otp = otp;
        user.otpExpiresAt = expiresAt;

        await user.save(); // Lưu thay đổi vào bảng User

        // Gửi phản hồi thành công
        res.status(200).send({ message: 'Mã OTP đã được gửi vào email!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi gửi OTP', error });
    }
};

// API xác thực OTP
// const verifyOtp = async (req, res) => {
//     const { email, otp } = req.body;

//     try {
//         // Tìm người dùng theo email
//         const user = await User.findOne({ Email: email.toLowerCase() });


//         // Kiểm tra nếu người dùng không tồn tại
//         if (!user) {
//             return res.status(400).json({ message: 'Người dùng không tồn tại' });
//         }

//         // Kiểm tra OTP và thời gian hết hạn của OTP
//         if (!user.otp || user.otp !== otp) {
//             return res.status(400).json({ message: 'Mã OTP không hợp lệ' });
//         }

//         // Kiểm tra thời gian hết hạn của OTP
//         if (user.otpExpiresAt < new Date()) {
//             // Xóa OTP khỏi bảng User nếu OTP đã hết hạn
//             user.otp = null;
//             user.otpExpiresAt = null;
//             await user.save(); // Lưu thay đổi

//             return res.status(400).json({ message: 'Mã OTP đã hết hạn' });
//         }

//         // OTP hợp lệ, cập nhật trạng thái xác thực cho người dùng
//         user.isVerify = true;
//         user.otp = null; // Xóa OTP sau khi xác thực
//         user.otpExpiresAt = null; // Xóa thời gian hết hạn OTP
//         await user.save(); // Lưu thay đổi vào bảng User

//         // Phản hồi thành công
//         res.status(200).json({ message: 'Người dùng đã được xác thực thành công' });
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi khi xác thực OTP', error });
//     }
// };

const verifyOtp = async (req, res) => { 
    // const { email, otp } = req.body;
    const { Email, otp } = req.body; 
    try {
        // const user = await User.findOne({ Email: email.toLowerCase() });
        
        const user = await User.findOne({ Email});

        if (!user) {
            return res.status(400).json({ message: 'Người dùng không tồn tại' });
        }

        // Kiểm tra nếu số lần nhập sai vượt quá 5 lần
        if (user.otpAttempts >= 5) {
            return res.status(429).json({ message: 'Bạn đã nhập sai OTP quá nhiều lần, vui lòng thử lại sau' });
        }

        // Kiểm tra OTP hợp lệ
        if (!user.otp || user.otp !== otp) {
            user.otpAttempts = (user.otpAttempts || 0) + 1;
            await user.save();
            return res.status(400).json({ message: 'Xác thực thất bại' });
        }
        // if (!user.otp || user.otp.trim() !== otp.trim()) {
        //     user.otpAttempts = (user.otpAttempts || 0) + 1;
        //     await user.save();
        //     return res.status(400).json({ message: 'Xác thực thất bại' });
        // }
        

        // Kiểm tra OTP đã hết hạn chưa
        if (user.otpExpiresAt < new Date()) {
            user.otp = null;
            user.otpExpiresAt = null;
            user.otpAttempts = 0; // Reset số lần nhập sai
            await user.save();
            return res.status(400).json({ message: 'Mã OTP đã hết hạn' });
        }

        // Nếu OTP đúng, cập nhật trạng thái xác thực
        user.isVerify = true;
        user.otp = null;
        user.otpExpiresAt = null;
        user.otpAttempts = 0; // Reset số lần nhập sai
        await user.save();

        res.status(200).json({ message: 'Người dùng đã được xác thực thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xác thực OTP', error });
    }
};


// API gửi lại OTP nếu OTP chưa hết hạn
const resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ Email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({ message: 'Người dùng không tồn tại' });
        }

        // Kiểm tra xem OTP đã gửi trước đó có tồn tại và chưa hết hạn không
        if (user.otp && user.otpExpiresAt > new Date()) {
            return res.status(400).json({ message: 'OTP vẫn còn hiệu lực, vui lòng kiểm tra email' });
        }

        // Tạo lại mã OTP mới
        const otp = crypto.randomInt(100000, 999999); // Mã OTP là 6 chữ số

        // Gửi OTP qua email
        sendOtpEmail(email, otp);

        // Cập nhật lại OTP và thời gian hết hạn vào bảng User
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP hết hạn sau 10 phút

        user.otp = otp;
        user.otpExpiresAt = expiresAt;

        await user.save(); // Lưu thay đổi vào bảng User

        // Gửi phản hồi thành công
        res.status(200).send({ message: 'Mã OTP mới đã được gửi vào email!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi gửi lại OTP', error });
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
    resendOtp
};


