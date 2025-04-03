const multer = require('multer');
const path = require('path');

// Cấu hình multer để lưu trữ file vào bộ nhớ tạm thời
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

// Chỉ cho phép upload ảnh
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

// const upload = multer({ storage });

module.exports = upload;
