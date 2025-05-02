const express = require("express");
const { registerUser } = require("../Controller/UserController");
const {deleteUser} = require('../Controller/UserController');
const {loginUser} = require('../Controller/UserController');
const {getUserById, getMusicStatus, updateMusicStatus } = require('../Controller/UserController')
const upload = require('../middleware/upload');
const router = express.Router();

// Định nghĩa các route liên quan đến user
// router.post('/register', upload.single('image'), registerUser);
router.post("/register", upload.single("ImageUrl"), registerUser);
router.delete('/deleteUser/:id', deleteUser);
router.post("/login", loginUser);
router.get("/getUserById/:id", getUserById);

// Kiểm tra trạng thái nhạc
router.get('/get/music-status', getMusicStatus);

// Cập nhật trạng thái nhạc
router.put('/update/music-status', updateMusicStatus);

module.exports = router;
