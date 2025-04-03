const express = require("express");
const { registerUser } = require("../Controller/UserController");
const {deleteUser} = require('../Controller/UserController')
const upload = require('../middleware/upload');
const router = express.Router();

// Định nghĩa các route liên quan đến user
// router.post('/register', upload.single('image'), registerUser);
router.post("/register", upload.single("ImageUrl"), registerUser);
router.delete('/deleteUser/:id', deleteUser);


module.exports = router;
