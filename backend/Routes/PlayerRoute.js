const express = require("express");
const router = express.Router();
const {createPlayer}= require("../Controller/PlayerController");

// Tạo cầu thủ mới
router.post("/create-player",createPlayer );

module.exports = router;
